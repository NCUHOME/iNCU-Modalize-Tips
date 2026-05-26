import fs from "node:fs";
import { select, isCancel } from "@clack/prompts";
import pc from "picocolors";
import type { CategoryEntry } from "../lib/types";
import { EXIT, PAGES_FILE } from "../lib/constants";
import { importPagesFile, readMeta, rebuildPagesFile } from "../lib/pages";
import { runGenerate, updatePageTsErrorIgnore } from "../lib/utils";
import {
  enterTui,
  waitForKey,
  renderScrolledList,
  type ScrolledListState,
} from "../lib/terminal";

// ---- Agent 模式 ----

export async function togglePageAgent(
  categoryId: string,
  pageId: string,
): Promise<boolean> {
  const cats = await importPagesFile();
  const cat = cats.find((c) => c.id === categoryId);
  if (!cat) throw new Error(`分类 "${categoryId}" 不存在`);
  const pg = cat.pages.find((p) => p.id === pageId);
  if (!pg) throw new Error(`页面 "${pageId}" 不存在于分类 "${categoryId}"`);

  const newState = !pg.enabled;
  pg.enabled = newState;
  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(cats), "utf-8");
  updatePageTsErrorIgnore(categoryId, pageId, newState);
  runGenerate();
  return newState;
}

// ---- 交互模式 ----

export async function toggleInCat() {
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
  const c = cat as CategoryEntry;

  let freshCats = await importPagesFile();
  let fresh = freshCats.find((x) => x.id === c.id)!;
  if (fresh.pages.length === 0) {
    console.log(pc.yellow("⚠️ 该分类下无页面"));
    return;
  }

  const cleanup = enterTui();
  let cursor = 0;
  let dirty = false;
  const state: ScrolledListState = { scrollOffset: 0 };

  async function render(): Promise<void> {
    freshCats = await importPagesFile();
    fresh = freshCats.find((x) => x.id === c.id)!;
    const pages = fresh.pages;

    if (cursor >= pages.length) cursor = Math.max(0, pages.length - 1);
    if (cursor < 0) cursor = 0;

    const header = [pc.bold(`🌕 启停: ${fresh.title}`), pc.dim("─".repeat(52))];

    const items: string[] = [];
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      const m = readMeta(fresh.id, p.id);
      const prefix = i === cursor ? pc.cyan(" ›") : "  ";
      const icon = p.enabled ? pc.green("🌕") : pc.dim("🌑");
      const label = p.enabled ? "启用" : "禁用";
      const desc = m.desc ? pc.dim(` — ${m.desc.slice(0, 26)}`) : "";
      items.push(`${prefix} ${icon} ${label}  ${pc.cyan(p.id)}${desc}`);
    }

    const footer = [
      pc.dim("─".repeat(52)),
      pc.dim("  ↑↓ 移动  |  → / Space 切换  |  ↵ / q 退出（自动保存）"),
    ];

    renderScrolledList(state, header, items, footer, cursor, null);
  }

  await render();

  while (true) {
    const key = await waitForKey();

    if (key.name === "quit" || key.name === "escape" || key.name === "enter")
      break;

    if (key.name === "up") {
      if (cursor > 0) {
        cursor--;
        await render();
      }
    } else if (key.name === "down") {
      if (cursor < fresh.pages.length - 1) {
        cursor++;
        await render();
      }
    } else if (key.name === "right" || key.name === "space") {
      const p = fresh.pages[cursor];
      const nState = !p.enabled;
      const allCats = await importPagesFile();
      const tgt = allCats.find((x) => x.id === c.id)!;
      const pg = tgt.pages.find((x) => x.id === p.id)!;
      pg.enabled = nState;
      fs.writeFileSync(PAGES_FILE, rebuildPagesFile(allCats), "utf-8");
      updatePageTsErrorIgnore(fresh.id, p.id, nState);
      dirty = true;
      await render();
    }
  }

  cleanup();

  if (dirty) runGenerate();
}
