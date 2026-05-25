import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { spinner } from '@clack/prompts';
import { ROOT } from './constants';

export function toPascalCase(str: string): string {
  return str.split(/[-\s]+/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const TEMPLATES_DIR = path.resolve(import.meta.dirname, '../templates');

/**
 * 读取模板文件并将 {{placeholder}} 替换为 vars 中对应的值
 */
export function applyTemplate(templateName: string, vars: Record<string, string>): string {
  const templatePath = path.join(TEMPLATES_DIR, templateName);
  let content = fs.readFileSync(templatePath, 'utf-8');
  for (const [key, value] of Object.entries(vars)) {
    content = content.replaceAll(`{{${key}}}`, value);
  }
  return content;
}

export function hasUncommittedChanges(): boolean {
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf-8' }).trim();
    return status.length > 0;
  } catch {
    return false;
  }
}

export function runGenerate(): void {
  const s = spinner();
  s.start('重新生成 manifest…');
  execSync('pnpm generate', { cwd: ROOT, stdio: 'pipe' });
  s.stop('Manifest 已更新');
}
