import fs from 'node:fs';
import { select, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import type { CategoryEntry } from '../lib/types';
import { EXIT, PAGES_FILE } from '../lib/constants';
import { parsePagesFile, readMeta, rebuildPagesFile } from '../lib/pages';
import { runGenerate } from '../lib/utils';
import {
  enterTui,
  waitForKey,
  renderScrolledList,
  type ScrolledListState,
} from '../lib/terminal';

export async function sortInCat() {
  const cats = parsePagesFile(fs.readFileSync(PAGES_FILE, 'utf-8'));
  if (cats.length === 0) { console.log(pc.yellow('⚠️ 没有分类')); return; }

  const cat = await select<CategoryEntry | typeof EXIT>({
    message: '选择要排序的分类:',
    options: [
      ...cats.map(c => ({ value: c, label: `${c.title} (${c.id}) — ${c.pages.length}页` })),
      { value: EXIT, label: '← 返回' },
    ],
  });
  if (isCancel(cat) || cat === EXIT) return;
  if (cat.pages.length <= 1) { console.log(pc.yellow('⚠️ 至少需要 2 个页面')); return; }
  const c = cat as CategoryEntry;

  const cleanup = enterTui();
  let cursor = 0;
  let selectedIdx: number | null = null;
  let pages = [...cat.pages];
  const state: ScrolledListState = { scrollOffset: 0 };

  function render(): void {
    if (cursor >= pages.length) cursor = Math.max(0, pages.length - 1);
    if (cursor < 0) cursor = 0;

    const header = [
      pc.bold(`↕️ 排序: ${c.title}`),
      pc.dim('─'.repeat(52)),
    ];

    const items: string[] = [];
    for (let i = 0; i < pages.length; i++) {
      const p = pages[i];
      const m = readMeta(c.id, p.id);
      const num = pc.dim(String(i + 1).padStart(2));

      let prefix: string;
      if (selectedIdx === i) {
        prefix = pc.cyan(' ●');
      } else if (i === cursor) {
        prefix = pc.cyan(' ›');
      } else {
        prefix = '  ';
      }

      const desc = m.desc ? pc.dim(` — ${m.desc.slice(0, 28)}`) : '';
      items.push(`  ${num} ${prefix} ${pc.cyan(p.id)}${desc}`);
    }

    const footer: string[] = [];
    footer.push(pc.dim('─'.repeat(52)));
    if (selectedIdx !== null) {
      footer.push(pc.cyan('  ↑↓ 移动排序项  |  → / ↵ / ← 放置  |  Esc 退出'));
    } else {
      footer.push(pc.dim('  ↑↓ 移动  |  → 选中排序  |  ↵ 保存退出  |  Esc / q 放弃'));
    }

    renderScrolledList(state, header, items, footer, cursor, selectedIdx);
  }

  render();

  while (true) {
    const key = await waitForKey();

    if (key.name === 'quit') {
      cleanup();
      console.log(pc.dim('  排序已取消'));
      return;
    }

    if (selectedIdx !== null) {
      // --- 移动模式 ---
      if (key.name === 'up') {
        if (selectedIdx > 0) {
          const item = pages.splice(selectedIdx, 1)[0];
          selectedIdx--;
          pages.splice(selectedIdx, 0, item);
          cursor = selectedIdx;
          render();
        }
      } else if (key.name === 'down') {
        if (selectedIdx < pages.length - 1) {
          const item = pages.splice(selectedIdx, 1)[0];
          selectedIdx++;
          pages.splice(selectedIdx, 0, item);
          cursor = selectedIdx;
          render();
        }
      } else if (key.name === 'right' || key.name === 'space' || key.name === 'enter' || key.name === 'left') {
        // 放置到光标位置
        if (cursor !== selectedIdx) {
          const item = pages.splice(selectedIdx, 1)[0];
          pages.splice(cursor, 0, item);
        }
        selectedIdx = null;
        render();
      } else if (key.name === 'escape') {
        cleanup();
        console.log(pc.dim('  排序已取消'));
        return;
      }
    } else {
      // --- 导航模式 ---
      if (key.name === 'up') {
        if (cursor > 0) { cursor--; render(); }
      } else if (key.name === 'down') {
        if (cursor < pages.length - 1) { cursor++; render(); }
      } else if (key.name === 'right') {
        selectedIdx = cursor;
        render();
      } else if (key.name === 'escape') {
        cleanup();
        console.log(pc.dim('  排序已取消'));
        return;
      } else if (key.name === 'enter') {
        // 保存并退出
        const all = parsePagesFile(fs.readFileSync(PAGES_FILE, 'utf-8'));
        const tgt = all.find(x => x.id === c.id)!;
        tgt.pages = pages;
        fs.writeFileSync(PAGES_FILE, rebuildPagesFile(all), 'utf-8');

        cleanup();
        console.log(pc.green('✅ 排序已保存'));
        runGenerate();
        return;
      }
    }
  }

  cleanup();
}
