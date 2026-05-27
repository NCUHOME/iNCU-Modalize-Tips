import fs from "node:fs";
import path from "node:path";
import { select, spinner, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { EXIT, ROUTES_DIR, PAGES_FILE } from "../lib/constants";
import { importPagesFile, readMeta, rebuildPagesFile } from "../lib/pages";
import { applyTemplate, runGenerate, toPascalCase } from "../lib/utils";

// ---- Agent 模式 ----

export async function healthCheckAgent(fix = false): Promise<string[]> {
  const cats = await importPagesFile();
  const issues: string[] = [];
  const definedPages = new Set<string>();
  const definedCats = new Set(cats.map((c) => c.id));
  const toDelete: string[] = [];

  for (const cat of cats) {
    for (const pg of cat.pages) {
      const k = `${cat.id}/${pg.id}`;
      definedPages.add(k);
      const dir = path.join(ROUTES_DIR, cat.id, pg.id);
      const metaPath = path.join(dir, "meta.ts");
      const pagePath = path.join(dir, "page.tsx");
      const hasMeta = fs.existsSync(metaPath);
      const hasPage = fs.existsSync(pagePath);

      if (!hasMeta && !hasPage) {
        issues.push(`⚠️  ${k} — 缺少 meta.ts 和 page.tsx`);
      } else {
        if (!hasMeta) issues.push(`⚠️  ${k} — 缺少 meta.ts`);
        if (!hasPage) issues.push(`⚠️  ${k} — 缺少 page.tsx`);
      }

      if (fix) {
        if (!hasMeta) {
          const m = readMeta(cat.id, pg.id);
          const metaContent = applyTemplate("page-meta.template", {
            title: m.title || pg.id,
            description: m.desc || pg.id,
            updatedAt: m.updatedAt || "",
          });
          fs.writeFileSync(metaPath, metaContent, "utf-8");
        }
        if (!hasPage) {
          const pageContent = applyTemplate("page.template", {
            categoryId: cat.id,
            pageId: pg.id,
            componentName: toPascalCase(pg.id),
          });
          fs.writeFileSync(pagePath, pageContent, "utf-8");
        }
      }

      if (hasMeta) {
        const m = readMeta(cat.id, pg.id);
        if (!m.title || m.title === pg.id) {
          issues.push(`💡 ${k} — meta 标题与 ID 相同，建议补充标题`);
        }
      }
    }
  }

  for (const catDir of fs.readdirSync(ROUTES_DIR, { withFileTypes: true })) {
    if (!catDir.isDirectory()) continue;
    const catPath = path.join(ROUTES_DIR, catDir.name);
    if (!definedCats.has(catDir.name)) {
      toDelete.push(catPath);
      issues.push(`🫥 ${catDir.name} — 孤立分类目录，未被 pages.ts 引用`);
      continue;
    }
    for (const pgDir of fs.readdirSync(catPath, { withFileTypes: true })) {
      if (!pgDir.isDirectory()) continue;
      const k = `${catDir.name}/${pgDir.name}`;
      if (!definedPages.has(k)) {
        toDelete.push(path.join(catPath, pgDir.name));
        issues.push(`🫥 ${k} — 孤立页面目录，未被 pages.ts 引用`);
      }
    }
  }

  for (const cat of cats) {
    const catPath = path.join(ROUTES_DIR, cat.id);
    const layoutPath = path.join(catPath, "layout.tsx");
    const indexPath = path.join(catPath, "index.tsx");
    if (!fs.existsSync(layoutPath)) {
      issues.push(`⚠️  ${cat.id} — 缺少 layout.tsx`);
      if (fix) {
        const pascalId = toPascalCase(cat.id);
        fs.writeFileSync(
          layoutPath,
          applyTemplate("layout.template", {
            componentName: pascalId,
            categoryId: cat.id,
          }),
          "utf-8",
        );
      }
    }
    if (!fs.existsSync(indexPath)) {
      issues.push(`⚠️  ${cat.id} — 缺少 index.tsx`);
      if (fix) {
        const pascalId = toPascalCase(cat.id);
        fs.writeFileSync(
          indexPath,
          applyTemplate("index.template", {
            componentName: pascalId,
            categoryId: cat.id,
          }),
          "utf-8",
        );
      }
    }
  }

  if (fix && toDelete.length > 0) {
    for (const d of toDelete) fs.rmSync(d, { recursive: true, force: true });
  }

  if (fix) runGenerate();
  return issues;
}

// ---- 交互模式 ----

export async function healthCheck() {
  const s = spinner();
  s.start("扫描项目…");

  const cats = await importPagesFile();
  const issues: string[] = [];
  const orphans: string[] = [];
  const definedPages = new Set<string>();
  const definedCats = new Set(cats.map((c) => c.id));

  for (const cat of cats) {
    for (const pg of cat.pages) {
      const k = `${cat.id}/${pg.id}`;
      definedPages.add(k);
      const dir = path.join(ROUTES_DIR, cat.id, pg.id);
      const hasMeta = fs.existsSync(path.join(dir, "meta.ts"));
      const hasPage = fs.existsSync(path.join(dir, "page.tsx"));

      if (!hasMeta && !hasPage) {
        issues.push(`⚠️  ${pc.yellow(k)} — 目录存在但缺少 meta.ts 和 page.tsx`);
      } else {
        if (!hasMeta) issues.push(`⚠️  ${pc.yellow(k)} — 缺少 meta.ts`);
        if (!hasPage) issues.push(`⚠️  ${pc.yellow(k)} — 缺少 page.tsx`);
      }

      if (hasMeta) {
        const m = readMeta(cat.id, pg.id);
        if (!m.title || m.title === pg.id) {
          issues.push(
            `💡 ${pc.dim(k)} — meta 标题与 ID 相同，建议补充有意义的标题`,
          );
        }
      }
    }
  }

  for (const catDir of fs.readdirSync(ROUTES_DIR, { withFileTypes: true })) {
    if (!catDir.isDirectory()) continue;
    const catPath = path.join(ROUTES_DIR, catDir.name);
    if (!definedCats.has(catDir.name)) {
      orphans.push(catPath);
      issues.push(
        `🫥 ${pc.red(catDir.name)} — 孤立分类目录（未被 pages.ts 引用）`,
      );
      continue;
    }
    for (const pgDir of fs.readdirSync(catPath, { withFileTypes: true })) {
      if (!pgDir.isDirectory()) continue;
      const k = `${catDir.name}/${pgDir.name}`;
      if (!definedPages.has(k)) {
        orphans.push(path.join(catPath, pgDir.name));
        issues.push(`🫥 ${pc.red(k)} — 孤立页面目录（未被 pages.ts 引用）`);
      }
    }
  }

  for (const cat of cats) {
    const catPath = path.join(ROUTES_DIR, cat.id);
    if (!fs.existsSync(path.join(catPath, "layout.tsx"))) {
      issues.push(`⚠️  ${pc.yellow(cat.id)} — 缺少 layout.tsx`);
    }
    if (!fs.existsSync(path.join(catPath, "index.tsx"))) {
      issues.push(`⚠️  ${pc.yellow(cat.id)} — 缺少 index.tsx`);
    }
  }

  s.stop("扫描完成");

  if (issues.length === 0) {
    console.log(pc.green("✅ 一切正常！没有发现问题。"));
    return;
  }

  console.log("");
  console.log(pc.bold(`发现 ${issues.length} 个问题:`));
  for (const issue of issues) {
    console.log(`  ${issue}`);
  }
  console.log("");

  if (orphans.length > 0) {
    const clean = await select<boolean | typeof EXIT>({
      message: `检测到 ${orphans.length} 个孤立目录，是否清理？`,
      options: [
        { value: true, label: `清理 ${orphans.length} 个孤立目录` },
        { value: false, label: "暂不处理" },
      ],
    });
    if (clean === true) {
      const s2 = spinner();
      s2.start("清理孤立目录…");
      for (const o of orphans) {
        fs.rmSync(o, { recursive: true, force: true });
      }
      s2.stop(`已清理 ${orphans.length} 个孤立目录`);
    }
  }
}
