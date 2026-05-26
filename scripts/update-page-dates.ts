#!/usr/bin/env tsx
// 检查暂存页面文件是否变更，自动更新 meta.ts 的 updatedAt 为当前月份

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROUTES_DIR = path.resolve(import.meta.dirname, "..", "app", "routes");
const ROUTES_REGEX = /^app\/routes\/([^/]+)\/([^/]+)\/(?!meta\.ts$).+$/;

// 当前月份中文标签，如 "2026年5月"
function nowMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

// 仅替换 meta.ts 中 updatedAt 一行，不动其他内容
function updateMetaDate(categoryId: string, pageId: string): boolean {
  const fp = path.join(ROUTES_DIR, categoryId, pageId, "meta.ts");
  if (!fs.existsSync(fp)) return false;

  const src = fs.readFileSync(fp, "utf-8");
  const newDate = nowMonth();

  const m = src.match(/(updatedAt:\s*)"[^"]*"/);
  if (!m) {
    // meta.ts 尚无 updatedAt 字段，在 } as const 前插入
    const inserted = src.replace(
      /(\n\} as const;)/,
      `,\n  updatedAt: "${newDate}"$1`,
    );
    fs.writeFileSync(fp, inserted, "utf-8");
    return true;
  }

  if (m[1] + `"${newDate}"` === m[0]) return false; // 已是最新

  const replaced = src.replace(/(updatedAt:\s*)"[^"]*"/, `$1"${newDate}"`);
  fs.writeFileSync(fp, replaced, "utf-8");
  return true;
}

async function main() {
  const staged = execSync("git diff --cached --name-only", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter(Boolean);

  const updated: string[] = [];

  for (const file of staged) {
    const m = file.match(ROUTES_REGEX);
    if (!m) continue;

    const [, category, pageId] = m;
    const key = `${category}/${pageId}`;
    if (updated.includes(key)) continue;

    if (updateMetaDate(category, pageId)) {
      updated.push(key);
    }
  }

  if (updated.length > 0) {
    const files = updated.map((p) => `app/routes/${p}/meta.ts`);
    execSync(`git add -- ${files.join(" ")}`);
    console.log(`📅 Page dates updated: ${updated.join(", ")}`);
  } else if (staged.some((f) => ROUTES_REGEX.test(f))) {
    console.log("📅 Page dates already up-to-date");
  } else {
    console.log("📅 No page files changed");
  }
}

main().catch((err) => {
  console.error("❌ Failed to update page dates:", err);
  process.exit(1);
});
