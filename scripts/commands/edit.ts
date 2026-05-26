import fs from "node:fs";
import { select, text, isCancel } from "@clack/prompts";
import pc from "picocolors";
import type { PageEntry, CategoryEntry } from "../lib/types";
import { EXIT, PAGES_FILE } from "../lib/constants";
import { importPagesFile, readMeta, writeMeta } from "../lib/pages";
import { runGenerate } from "../lib/utils";

export async function editInCat() {
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
    message: "选择要编辑的页面:",
    options: [
      ...cat.pages.map((p) => {
        const m = readMeta(cat.id, p.id);
        return { value: p, label: `${p.id} — ${m.desc || "(无描述)"}` };
      }),
      { value: EXIT, label: "← 返回" },
    ],
  });
  if (isCancel(pg) || pg === EXIT) return;

  const cur = readMeta(cat.id, pg.id);

  const nt = await text({
    message: "标题（留空不变）:",
    placeholder: cur.title,
  });
  if (isCancel(nt)) return;

  const nd = await text({
    message: "描述（留空不变）:",
    placeholder: cur.desc || "(空)",
  });
  if (isCancel(nd)) return;

  const title = (nt || cur.title).trim();
  // nd is "" (not null) when user leaves it blank — use || not ??
  const desc = (nd || cur.desc).trim();
  if (title === cur.title && desc === cur.desc) {
    console.log(pc.dim("  无变更"));
    return;
  }

  writeMeta(cat.id, pg.id, title, desc, cur.image, cur.updatedAt);
  console.log(pc.green(`  ✅ ${pg.id} 已更新`));
  runGenerate();
}
