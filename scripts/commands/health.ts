import fs from 'node:fs';
import path from 'node:path';
import { select, spinner, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import { EXIT, ROUTES_DIR, PAGES_FILE } from '../lib/constants';
import { parsePagesFile, readMeta } from '../lib/pages';

export async function healthCheck() {
  const s = spinner();
  s.start('扫描项目…');

  const cats = parsePagesFile(fs.readFileSync(PAGES_FILE, 'utf-8'));
  const issues: string[] = [];
  const orphans: string[] = [];
  const definedPages = new Set<string>();

  for (const cat of cats) {
    for (const pg of cat.pages) {
      const k = `${cat.id}/${pg.id}`;
      definedPages.add(k);
      const dir = path.join(ROUTES_DIR, cat.id, pg.id);
      const hasMeta = fs.existsSync(path.join(dir, 'meta.ts'));
      const hasPage = fs.existsSync(path.join(dir, 'page.tsx'));

      if (!hasMeta && !hasPage) {
        issues.push(`⚠️  ${pc.yellow(k)} — 目录存在但缺少 meta.ts 和 page.tsx`);
      } else {
        if (!hasMeta) issues.push(`⚠️  ${pc.yellow(k)} — 缺少 meta.ts`);
        if (!hasPage) issues.push(`⚠️  ${pc.yellow(k)} — 缺少 page.tsx`);
      }

      if (hasMeta) {
        const m = readMeta(cat.id, pg.id);
        if (!m.title || m.title === pg.id) {
          issues.push(`💡 ${pc.dim(k)} — meta 标题与 ID 相同，建议补充有意义的标题`);
        }
      }
    }
  }

  for (const catDir of fs.readdirSync(ROUTES_DIR, { withFileTypes: true })) {
    if (!catDir.isDirectory()) continue;
    const catP = path.join(ROUTES_DIR, catDir.name);
    for (const pgDir of fs.readdirSync(catP, { withFileTypes: true })) {
      if (!pgDir.isDirectory()) continue;
      const k = `${catDir.name}/${pgDir.name}`;
      if (!definedPages.has(k)) {
        orphans.push(path.join(ROUTES_DIR, catDir.name, pgDir.name));
        issues.push(`🫥 ${pc.red(k)} — 孤立目录（未被 pages.ts 引用）`);
      }
    }
  }

  for (const cat of cats) {
    const catPath = path.join(ROUTES_DIR, cat.id);
    if (!fs.existsSync(path.join(catPath, 'layout.tsx'))) {
      issues.push(`⚠️  ${pc.yellow(cat.id)} — 缺少 layout.tsx`);
    }
    if (!fs.existsSync(path.join(catPath, 'index.tsx'))) {
      issues.push(`⚠️  ${pc.yellow(cat.id)} — 缺少 index.tsx`);
    }
  }

  s.stop('扫描完成');

  if (issues.length === 0) {
    console.log(pc.green('✅ 一切正常！没有发现问题。'));
    return;
  }

  console.log('');
  console.log(pc.bold(`发现 ${issues.length} 个问题:`));
  for (const issue of issues) {
    console.log(`  ${issue}`);
  }
  console.log('');

  if (orphans.length > 0) {
    const clean = await select<boolean | typeof EXIT>({
      message: `检测到 ${orphans.length} 个孤立目录，是否清理？`,
      options: [
        { value: true, label: `清理 ${orphans.length} 个孤立目录` },
        { value: false, label: '暂不处理' },
      ],
    });
    if (clean === true) {
      const s2 = spinner();
      s2.start('清理孤立目录…');
      for (const o of orphans) {
        fs.rmSync(o, { recursive: true, force: true });
      }
      s2.stop(`已清理 ${orphans.length} 个孤立目录`);
    }
  }
}
