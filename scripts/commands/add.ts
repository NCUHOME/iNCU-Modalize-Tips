import fs from 'node:fs';
import path from 'node:path';
import { select, text, spinner, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import type { CategoryEntry } from '../lib/types';
import { EXIT, BACK, ROUTES_DIR, PAGES_FILE } from '../lib/constants';
import { parsePagesFile } from '../lib/pages';
import { applyTemplate, runGenerate, toPascalCase } from '../lib/utils';

export async function addPage() {
  const content = fs.readFileSync(PAGES_FILE, 'utf-8');
  const cats = parsePagesFile(content);

  if (cats.length === 0) {
    console.log(pc.yellow('⚠️  没有可用的分类，请先新增分类。'));
    return;
  }

  type Step = 'category' | 'pageId' | 'title' | 'desc' | 'enabled' | 'done';
  let step: Step = 'category';

  let category: CategoryEntry | undefined;
  let pageId: string | undefined;
  let title: string | undefined;
  let description: string | undefined;
  let enabled: boolean | undefined;

  while (step !== 'done') {
    switch (step) {
      case 'category': {
        const r = await select<CategoryEntry | typeof EXIT>({
          message: '选择目标分类:',
          options: [
            ...cats.map((c) => ({ value: c, label: `${c.title} (${c.id})` })),
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        category = r;
        step = 'pageId';
        break;
      }

      case 'pageId': {
        const r = await text({
          message: '页面 ID（输入 .. 返回上一步）:',
          placeholder: '如 coloros',
          validate: (v) => {
            if (v === '..') return undefined;
            if (!v) return '页面 ID 不能为空';
            if (!/^[a-z][a-z0-9-]*$/.test(v)) return '只能包含小写字母、数字和连字符，且必须以字母开头';
            if (category!.pages.some((p) => p.id === v)) return `页面 "${v}" 已存在于该分类中`;
          },
        });
        if (isCancel(r)) return;
        if (r === '..') { step = 'category'; break; }
        pageId = r;
        step = 'title';
        break;
      }

      case 'title': {
        const r = await text({
          message: '页面标题（输入 .. 返回上一步）:',
          placeholder: '如 ColorOS 添加小组件',
          validate: (v) => {
            if (v === '..') return undefined;
            if (!v) return '页面标题不能为空';
          },
        });
        if (isCancel(r)) return;
        if (r === '..') { step = 'pageId'; break; }
        title = r;
        step = 'desc';
        break;
      }

      case 'desc': {
        const r = await text({
          message: '页面描述（输入 .. 返回上一步）:',
          placeholder: '简要描述该页面内容',
          validate: () => undefined,
        });
        if (isCancel(r)) return;
        if (r === '..') { step = 'title'; break; }
        description = r;
        step = 'enabled';
        break;
      }

      case 'enabled': {
        const r = await select<boolean | typeof BACK>({
          message: '是否启用该页面?',
          options: [
            { value: true, label: '启用' },
            { value: false, label: '禁用（占位页面）' },
            { value: BACK, label: '← 返回上一步' },
          ],
        });
        if (isCancel(r)) return;
        if (r === BACK) { step = 'desc'; break; }
        enabled = r;
        step = 'done';
        break;
      }
    }
  }

  const dir = path.join(ROUTES_DIR, category!.id, pageId!);
  if (fs.existsSync(dir)) {
    console.log(pc.yellow(`⚠️  目录 ${category!.id}/${pageId} 已存在。`));
    return;
  }

  // Execute creation
  const s = spinner();
  s.start('创建页面文件…');

  fs.mkdirSync(dir, { recursive: true });

  const metaContent = applyTemplate('page-meta.template', {
    title: title!,
    description: description!,
  });
  fs.writeFileSync(path.join(dir, 'meta.ts'), metaContent, 'utf-8');

  const pageContent = applyTemplate('page.template', {
    categoryId: category!.id,
    pageId: pageId!,
    componentName: toPascalCase(pageId!),
  });
  fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf-8');

  const newContent = content.replace(
    new RegExp(`(id:\\s*'${category!.id}'[\\s\\S]*?pages:\\s*\\[[\\s\\S]*?)(\\n\\s+\\]\\s+as\\s+const,)`),
    `$1\n      { id: '${pageId}', enabled: ${enabled} },$2`,
  );
  fs.writeFileSync(PAGES_FILE, newContent, 'utf-8');

  s.stop(`页面 ${pc.green(`${category!.id}/${pageId}`)} 已创建`);

  runGenerate();
}

export async function addCategory() {
  const content = fs.readFileSync(PAGES_FILE, 'utf-8');
  const cats = parsePagesFile(content);

  type Step = 'categoryId' | 'title' | 'desc' | 'order' | 'done';
  let step: Step = 'categoryId';

  let categoryId: string | undefined;
  let title: string | undefined;
  let description: string | undefined;
  let orderNum: number | undefined;

  while (step !== 'done') {
    switch (step) {
      case 'categoryId': {
        const r = await text({
          message: '分类 ID（输入 .. 返回首页）:',
          placeholder: '如 widget-guide',
          validate: (v) => {
            if (v === '..') return undefined;
            if (!v) return '分类 ID 不能为空';
            if (!/^[a-z][a-z0-9-]*$/.test(v)) return '只能包含小写字母、数字和连字符，且必须以字母开头';
            if (cats.some((c) => c.id === v)) return `分类 "${v}" 已存在`;
          },
        });
        if (isCancel(r) || r === '..') return;
        categoryId = r;
        step = 'title';
        break;
      }

      case 'title': {
        const r = await text({
          message: '分类标题（输入 .. 返回上一步）:',
          placeholder: '如 如何添加小组件',
          validate: (v) => {
            if (v === '..') return undefined;
            if (!v) return '分类标题不能为空';
          },
        });
        if (isCancel(r)) return;
        if (r === '..') { step = 'categoryId'; break; }
        title = r;
        step = 'desc';
        break;
      }

      case 'desc': {
        const r = await text({
          message: '分类描述（输入 .. 返回上一步）:',
          placeholder: '简要描述该分类的内容',
          validate: () => undefined,
        });
        if (isCancel(r)) return;
        if (r === '..') { step = 'title'; break; }
        description = r;
        step = 'order';
        break;
      }

      case 'order': {
        const nextOrder = cats.length > 0 ? Math.max(...cats.map((c) => c.order)) + 1 : 1;
        const r = await text({
          message: '排序序号（输入 .. 返回上一步）:',
          placeholder: `${nextOrder}`,
          validate: (v) => {
            if (v === '..') return undefined;
            if (v && isNaN(Number(v))) return '请输入数字';
          },
        });
        if (isCancel(r)) return;
        if (r === '..') { step = 'desc'; break; }
        orderNum = r ? parseInt(r, 10) : nextOrder;
        step = 'done';
        break;
      }
    }
  }

  const catDir = path.join(ROUTES_DIR, categoryId!);
  if (fs.existsSync(catDir)) {
    console.log(pc.yellow(`⚠️  目录 ${categoryId} 已存在。`));
    return;
  }

  const s = spinner();
  s.start('创建分类文件…');

  fs.mkdirSync(catDir, { recursive: true });

  const pascalId = toPascalCase(categoryId!);
  const layoutContent = applyTemplate('layout.template', {
    componentName: pascalId,
  });

  const indexContent = applyTemplate('index.template', {
    categoryId: categoryId!,
    componentName: pascalId,
  });

  fs.writeFileSync(path.join(catDir, 'layout.tsx'), layoutContent, 'utf-8');
  fs.writeFileSync(path.join(catDir, 'index.tsx'), indexContent, 'utf-8');

  const categoryBlock = `  {
    id: '${categoryId}',
    title: '${title}',
    description: '${description}',
    order: ${orderNum},
    pages: [
    ] as const,
  },
`;
  const newContent = content.replace(/(\] as const;)/, `${categoryBlock}$1`);
  fs.writeFileSync(PAGES_FILE, newContent, 'utf-8');

  s.stop(`分类 ${pc.green(categoryId)} 已创建`);

  runGenerate();
}
