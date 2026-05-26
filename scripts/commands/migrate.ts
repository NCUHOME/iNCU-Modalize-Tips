import fs from "node:fs";
import path from "node:path";
import { select, spinner, isCancel } from "@clack/prompts";
import pc from "picocolors";
import type { PageEntry, CategoryEntry } from "../lib/types";
import { EXIT, ROUTES_DIR, PAGES_FILE } from "../lib/constants";
import { importPagesFile, rebuildPagesFile, readMeta } from "../lib/pages";
import { runGenerate } from "../lib/utils";

// ---- Agent 模式 ----

export async function migratePageAgent(
  fromId: string,
  toId: string,
  pageId: string,
  force: boolean,
): Promise<void> {
  const cats = await importPagesFile();
  const fromCat = cats.find((c) => c.id === fromId);
  if (!fromCat) throw new Error(`来源分类 "${fromId}" 不存在`);
  const toCat = cats.find((c) => c.id === toId);
  if (!toCat) throw new Error(`目标分类 "${toId}" 不存在`);

  const pg = fromCat.pages.find((p) => p.id === pageId);
  if (!pg) throw new Error(`页面 "${pageId}" 不在分类 "${fromId}" 中`);
  if (!force && toCat.pages.some((p) => p.id === pageId))
    throw new Error(
      `目标分类 "${toId}" 已存在页面 "${pageId}"，使用 --force 覆盖`,
    );

  fromCat.pages = fromCat.pages.filter((p) => p.id !== pageId);
  toCat.pages = toCat.pages.filter((p) => p.id !== pageId);
  toCat.pages.push({ id: pageId, enabled: pg.enabled });

  const fromDir = path.join(ROUTES_DIR, fromId, pageId);
  const toDir = path.join(ROUTES_DIR, toId, pageId);
  if (fs.existsSync(fromDir)) {
    fs.mkdirSync(path.dirname(toDir), { recursive: true });
    fs.renameSync(fromDir, toDir);
  }

  // 更新 page.tsx 中硬编码的 categoryId
  const pageFile = path.join(toDir, "page.tsx");
  if (fs.existsSync(pageFile)) {
    let src = fs.readFileSync(pageFile, "utf-8");
    src = src.replaceAll(`"${fromId}"`, `"${toId}"`);
    fs.writeFileSync(pageFile, src, "utf-8");
  }

  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(cats), "utf-8");
  runGenerate();
}

// ---- 交互模式 ----

export async function migratePage() {
  const cats = await importPagesFile();

  if (cats.length < 2) {
    console.log(pc.yellow("⚠️  至少需要 2 个分类才能迁移页面。"));
    return;
  }

  const fromCat = await select<CategoryEntry | typeof EXIT>({
    message: "选择来源分类:",
    options: [
      ...cats.map((c) => ({
        value: c,
        label: `${c.title} (${c.id}) — ${c.pages.length} 个页面`,
      })),
      { value: EXIT, label: "← 返回首页" },
    ],
  });
  if (isCancel(fromCat) || fromCat === EXIT) return;
  if (fromCat.pages.length === 0) {
    console.log(pc.yellow("⚠️  该分类下没有页面。"));
    return;
  }

  const pg = await select<PageEntry | typeof EXIT>({
    message: "选择要迁移的页面:",
    options: [
      ...fromCat.pages.map((p) => {
        const m = readMeta(fromCat.id, p.id);
        return { value: p, label: `${p.id} — ${m.desc || ""} ` };
      }),
      { value: EXIT, label: "← 返回首页" },
    ],
  });
  if (isCancel(pg) || pg === EXIT) return;

  const others = cats.filter((c) => c.id !== fromCat.id);
  const toCat = await select<CategoryEntry | typeof EXIT>({
    message: `将 ${pc.cyan(`${fromCat.id}/${pg.id}`)} 迁移到:`,
    options: [
      ...others.map((c) => ({ value: c, label: `${c.title} (${c.id})` })),
      { value: EXIT, label: "← 返回首页" },
    ],
  });
  if (isCancel(toCat) || toCat === EXIT) return;

  if (toCat.pages.some((p) => p.id === pg.id)) {
    console.log(
      pc.yellow(`⚠️  目标分类 "${toCat.id}" 中已存在页面 "${pg.id}"。`),
    );
    return;
  }

  const confirm = await select<boolean | typeof EXIT>({
    message: `确认将 ${pc.cyan(`${fromCat.id}/${pg.id}`)} 迁移到 ${pc.cyan(toCat.id)}?`,
    options: [
      { value: true, label: "确认迁移" },
      { value: false, label: "取消" },
    ],
  });
  if (!confirm) return;

  const s = spinner();
  s.start("迁移页面…");

  const fromDir = path.join(ROUTES_DIR, fromCat.id, pg.id);
  const toDir = path.join(ROUTES_DIR, toCat.id, pg.id);
  if (fs.existsSync(fromDir)) {
    fs.mkdirSync(path.dirname(toDir), { recursive: true });
    fs.renameSync(fromDir, toDir);
  }

  const allCats = await importPagesFile();
  const srcCat = allCats.find((c) => c.id === fromCat.id)!;
  const dstCat = allCats.find((c) => c.id === toCat.id)!;
  srcCat.pages = srcCat.pages.filter((p) => p.id !== pg.id);
  dstCat.pages.push({ id: pg.id, enabled: pg.enabled });
  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(allCats), "utf-8");

  s.stop(`页面已从 ${pc.cyan(fromCat.id)} 迁移到 ${pc.cyan(toCat.id)}`);

  runGenerate();
}
