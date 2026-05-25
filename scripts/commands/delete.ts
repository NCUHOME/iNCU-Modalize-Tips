import fs from "node:fs";
import path from "node:path";
import { select, spinner, isCancel } from "@clack/prompts";
import pc from "picocolors";
import type { PageEntry, CategoryEntry } from "../lib/types";
import { EXIT, BACK, ROUTES_DIR, PAGES_FILE } from "../lib/constants";
import { importPagesFile, rebuildPagesFile } from "../lib/pages";
import { hasUncommittedChanges, runGenerate } from "../lib/utils";

/** Quick delete from manage menu */
export async function deleteFromManage() {
  const cats = await importPagesFile();
  if (cats.length === 0) {
    console.log(pc.yellow("⚠️ 没有分类"));
    return;
  }

  const cat = await select<CategoryEntry | typeof EXIT>({
    message: "选择分类:",
    options: [
      ...cats.map((c) => ({
        value: c,
        label: `${c.title} (${c.id}) — ${c.pages.length}页`,
      })),
      { value: EXIT, label: "← 返回" },
    ],
  });
  if (isCancel(cat) || cat === EXIT) return;
  if (cat.pages.length === 0) {
    console.log(pc.yellow("⚠️ 该分类下无页面"));
    return;
  }

  const pg = await select<PageEntry | typeof EXIT>({
    message: "选择要删除的页面:",
    options: [
      ...cat.pages.map((p) => ({
        value: p,
        label: `${p.id} ${pc.dim(p.enabled ? "(启用)" : "(禁用)")}`,
      })),
      { value: EXIT, label: "← 取消" },
    ],
  });
  if (isCancel(pg) || pg === EXIT) return;

  const confirm = await select<boolean | typeof EXIT>({
    message: `确认删除 ${pc.red(`${cat.id}/${pg.id}`)}?`,
    options: [
      { value: true, label: "确认删除" },
      { value: false, label: "取消" },
    ],
  });
  if (!confirm) return;

  const s = spinner();
  s.start("删除中…");

  const pgDir = path.join(ROUTES_DIR, cat.id, pg.id);
  if (fs.existsSync(pgDir)) fs.rmSync(pgDir, { recursive: true, force: true });

  const all = await importPagesFile();
  const tgt = all.find((c) => c.id === cat.id)!;
  tgt.pages = tgt.pages.filter((p) => p.id !== pg.id);
  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(all), "utf-8");

  s.stop(`已删除 ${pc.red(`${cat.id}/${pg.id}`)}`);
  runGenerate();
}

/** Step-by-step page deletion with back navigation */
export async function deletePage() {
  const cats = await importPagesFile();

  if (cats.length === 0) {
    console.log(pc.yellow("⚠️  没有可用的分类。"));
    return;
  }

  type Step = "category" | "page" | "confirm" | "git-check" | "done";
  let step: Step = "category";

  let category: CategoryEntry | undefined;
  let targetPage: PageEntry | undefined;

  while (step !== "done") {
    switch (step) {
      case "category": {
        const r = await select<CategoryEntry | typeof EXIT>({
          message: "选择目标分类:",
          options: [
            ...cats.map((c) => ({ value: c, label: `${c.title} (${c.id})` })),
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r.pages.length === 0) {
          console.log(pc.yellow("⚠️  该分类下没有页面。"));
          return;
        }
        category = r;
        step = "page";
        break;
      }

      case "page": {
        const r = await select<PageEntry | typeof BACK | typeof EXIT>({
          message: "选择要删除的页面:",
          options: [
            ...category!.pages.map((p) => ({
              value: p,
              label: `${p.id} ${pc.dim(p.enabled ? "(启用)" : "(禁用)")}`,
            })),
            { value: BACK, label: "← 返回上一步" },
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) {
          step = "category";
          break;
        }
        targetPage = r;
        step = "confirm";
        break;
      }

      case "confirm": {
        const r = await select<boolean | typeof BACK | typeof EXIT>({
          message: `确认删除页面 ${pc.red(`${category!.id}/${targetPage!.id}`)}?`,
          options: [
            { value: true, label: "确认删除" },
            { value: BACK, label: "← 返回上一步" },
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) {
          step = "page";
          break;
        }
        step = "git-check";
        break;
      }

      case "git-check": {
        if (!hasUncommittedChanges()) {
          step = "done";
          break;
        }
        const r = await select<string | typeof BACK | typeof EXIT>({
          message: pc.yellow("有未提交的 git 变更，继续删除可能丢失数据"),
          options: [
            { value: "proceed", label: "仍然删除" },
            { value: BACK, label: "← 返回上一步" },
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) {
          step = "confirm";
          break;
        }
        step = "done";
        break;
      }
    }
  }

  const s = spinner();
  s.start("删除页面…");

  const pageDir = path.join(ROUTES_DIR, category!.id, targetPage!.id);
  if (fs.existsSync(pageDir)) {
    fs.rmSync(pageDir, { recursive: true, force: true });
  }

  const allCats = await importPagesFile();
  const srcCat = allCats.find((c) => c.id === category!.id)!;
  srcCat.pages = srcCat.pages.filter((p) => p.id !== targetPage!.id);
  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(allCats), "utf-8");

  s.stop(`页面 ${pc.red(`${category!.id}/${targetPage!.id}`)} 已删除`);

  runGenerate();
}

/** Full category deletion */
export async function deleteCategory() {
  const cats = await importPagesFile();

  if (cats.length === 0) {
    console.log(pc.yellow("⚠️  没有可用的分类。"));
    return;
  }

  type Step = "category" | "confirm" | "git-check" | "done";
  let step: Step = "category";

  let category: CategoryEntry | undefined;

  while (step !== "done") {
    switch (step) {
      case "category": {
        const r = await select<CategoryEntry | typeof EXIT>({
          message: "选择要删除的分类:",
          options: [
            ...cats.map((c) => ({
              value: c,
              label: `${c.title} (${c.id}) — ${c.pages.length} 个页面`,
            })),
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        category = r;

        if (category.pages.length > 0) {
          console.log(
            pc.yellow(
              `⚠️  该分类包含 ${category.pages.length} 个页面，删除分类将同时删除所有页面文件。`,
            ),
          );
          console.log(
            pc.dim(`  页面: ${category.pages.map((p) => p.id).join(", ")}`),
          );
        }

        step = "confirm";
        break;
      }

      case "confirm": {
        const r = await select<boolean | typeof BACK | typeof EXIT>({
          message: `确认删除分类 ${pc.red(category!.id)}? 此操作不可恢复`,
          options: [
            { value: true, label: "确认删除" },
            { value: BACK, label: "← 返回上一步" },
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) {
          step = "category";
          break;
        }
        step = "git-check";
        break;
      }

      case "git-check": {
        if (!hasUncommittedChanges()) {
          step = "done";
          break;
        }
        const r = await select<string | typeof BACK | typeof EXIT>({
          message: pc.yellow("有未提交的 git 变更，继续删除可能丢失数据"),
          options: [
            { value: "proceed", label: "仍然删除" },
            { value: BACK, label: "← 返回上一步" },
            { value: EXIT, label: "← 返回首页" },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) {
          step = "confirm";
          break;
        }
        step = "done";
        break;
      }
    }
  }

  const s = spinner();
  s.start("删除分类…");

  const catDir = path.join(ROUTES_DIR, category!.id);
  if (fs.existsSync(catDir)) {
    fs.rmSync(catDir, { recursive: true, force: true });
  }

  const allCats = await importPagesFile();
  const filtered = allCats.filter((c) => c.id !== category!.id);
  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(filtered), "utf-8");

  s.stop(`分类 ${pc.red(category!.id)} 已删除`);

  runGenerate();
}
