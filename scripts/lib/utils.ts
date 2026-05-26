import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { spinner } from "@clack/prompts";
import { ROOT } from "./constants";

export function toPascalCase(str: string): string {
  return str
    .split(/[-\s]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const TEMPLATES_DIR = path.resolve(import.meta.dirname, "../templates");

/**
 * 读取模板文件并将 {{placeholder}} 替换为 vars 中对应的值
 */
export function applyTemplate(
  templateName: string,
  vars: Record<string, string>,
): string {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  let content = fs.readFileSync(templatePath, "utf-8");
  for (const [key, value] of Object.entries(vars)) {
    content = content.replaceAll(`{{${key}}}`, value);
  }
  return content;
}

export function hasUncommittedChanges(): boolean {
  try {
    const status = execSync("git status --porcelain", {
      cwd: ROOT,
      encoding: "utf-8",
    }).trim();
    return status.length > 0;
  } catch {
    return false;
  }
}

export function runGenerate(): void {
  const s = spinner();
  s.start("重新生成 manifest…");
  execSync("pnpm generate", { cwd: ROOT, stdio: "pipe" });
  s.stop("Manifest 已更新");
}

const TYPES_IMPORT_PATTERN = 'import type { Route } from "./+types/page"';

/**
 * 根据页面启用状态，自动添加/移除 import 上的 @ts-expect-error
 *
 * 禁用时: 在 import type { Route } 前加 // @ts-expect-error
 * 启用时: 移除前面的 // @ts-expect-error
 */
export function updatePageTsErrorIgnore(
  categoryId: string,
  pageId: string,
  enabled: boolean,
): void {
  const pageFile = path.join(
    ROOT,
    "app",
    "routes",
    categoryId,
    pageId,
    "page.tsx",
  );
  if (!fs.existsSync(pageFile)) return;

  let content = fs.readFileSync(pageFile, "utf-8");
  const lines = content.split("\n");
  let changed = false;

  if (!enabled) {
    // 禁用 → 在 import 前加 @ts-expect-error
    const importIdx = lines.findIndex((l) => l.includes(TYPES_IMPORT_PATTERN));
    if (
      importIdx !== -1 &&
      (importIdx === 0 || !lines[importIdx - 1].includes("@ts-expect-error"))
    ) {
      lines.splice(
        importIdx,
        0,
        "// @ts-expect-error 禁用页面 — 路由类型未生成",
      );
      changed = true;
    }
  } else {
    // 启用 → 移除 @ts-expect-error
    const importIdx = lines.findIndex((l) => l.includes(TYPES_IMPORT_PATTERN));
    if (importIdx > 0 && lines[importIdx - 1].includes("@ts-expect-error")) {
      lines.splice(importIdx - 1, 1);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(pageFile, lines.join("\n"), "utf-8");
  }
}
