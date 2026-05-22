#!/usr/bin/env tsx
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { intro, outro, select, text, spinner, cancel, isCancel } from '@clack/prompts';
import pc from 'picocolors';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES_FILE = path.join(ROOT, 'app', 'pages.ts');
const ROUTES_DIR = path.join(ROOT, 'app', 'routes');

const EXIT = '<exit>';
const BACK = '<back>';

// ---- Types ----

type PageEntry = { id: string; enabled: boolean };
type CategoryEntry = {
  id: string;
  title: string;
  description: string;
  order: number;
  pages: PageEntry[];
};

// ---- Helpers ----

function toPascalCase(str: string): string {
  return str.split(/[-\s]+/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function parsePagesFile(content: string): CategoryEntry[] {
  const categories: CategoryEntry[] = [];
  const categoryRegex = /\{\s*\n\s+id:\s*'([^']+)',\s*\n\s+title:\s*'([^']*)',\s*\n\s+description:\s*'([^']*)',\s*\n\s+order:\s*(\d+),\s*\n\s+pages:\s*\[([\s\S]*?)\]\s*as\s+const,\s*\n\s*\},/g;
  let match: RegExpExecArray | null;
  while ((match = categoryRegex.exec(content)) !== null) {
    const pages: PageEntry[] = [];
    const pageRegex = /\{\s*id:\s*'([^']+)',\s*enabled:\s*(true|false)\s*\},?/g;
    let pm: RegExpExecArray | null;
    while ((pm = pageRegex.exec(match[5])) !== null) {
      pages.push({ id: pm[1], enabled: pm[2] === 'true' });
    }
    categories.push({
      id: match[1],
      title: match[2],
      description: match[3],
      order: parseInt(match[4], 10),
      pages,
    });
  }
  return categories;
}

function hasUncommittedChanges(): boolean {
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf-8' }).trim();
    return status.length > 0;
  } catch {
    return false;
  }
}

function runGenerate(): void {
  const s = spinner();
  s.start('重新生成 manifest…');
  execSync('pnpm generate', { cwd: ROOT, stdio: 'pipe' });
  s.stop('Manifest 已更新');
}

// ---- Add Page ----

async function addPage() {
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

  const metaContent = `export const routeMeta = {
  title: '${title}',
  description: '${description}',
} as const;
`;
  fs.writeFileSync(path.join(dir, 'meta.ts'), metaContent, 'utf-8');

  const pageContent = `import { useLocation } from "react-router";
import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/page";
import { DetailHeader } from "~/components/DetailHeader";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === '${category!.id}')
    ?.pages.find((p) => p.id === '${pageId}');
  return [{ title: page?.title }, { name: 'description', content: page?.description }];
}

export default function OsPage() {
  const path = useLocation().pathname;
  const [, categoryId, pageId] = path.split("/");
  const category = routeManifest.categories.find((c) => c.id === categoryId);
  const page = category?.pages.find((p) => p.id === pageId);

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <DetailHeader title={page?.title ?? pageId} image={page?.image} />
        <div className="mt-8 text-(--text-tertiary) text-sm">
          此页面正在准备中，敬请期待。
        </div>
      </div>
    </article>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), pageContent, 'utf-8');

  const newContent = content.replace(
    new RegExp(`(id:\\s*'${category!.id}'[\\s\\S]*?pages:\\s*\\[[\\s\\S]*?)(\\n\\s+\\]\\s+as\\s+const,)`),
    `$1\n      { id: '${pageId}', enabled: ${enabled} },$2`,
  );
  fs.writeFileSync(PAGES_FILE, newContent, 'utf-8');

  s.stop(`页面 ${pc.green(`${category!.id}/${pageId}`)} 已创建`);

  runGenerate();
}

// ---- Add Category ----

async function addCategory() {
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

  const layoutContent = `import { Outlet, useMatches, useNavigate } from "react-router";

export default function ${toPascalCase(categoryId!)}Layout() {
  const navigate = useNavigate();
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const isIndex = lastMatch.id.endsWith("/index");

  return (
    <div className="min-h-screen p-5" style={{ maxWidth: 640, margin: "0 auto" }}>
      {!isIndex && (
        <button
          onClick={() => navigate(-1)}
          className="back-link anim-slide-left mb-5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回
        </button>
      )}
      <Outlet />
    </div>
  );
}
`;

  const indexContent = `import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";
import { GuideCard } from "~/components/GuideCard";

export function meta({}: Route.MetaArgs) {
  const category = routeManifest.categories.find(
    (c) => c.id === "${categoryId}",
  );
  return [
    { title: category?.title },
    { name: "description", content: category?.description },
  ];
}

export default function ${toPascalCase(categoryId!)}Index() {
  const category = routeManifest.categories.find(
    (c) => c.id === "${categoryId}",
  );
  if (!category) return null;

  const enabledPages = category.pages.filter((p) => p.enabled);

  return (
    <div>
      <header className="mb-6 anim-fade-up">
        <h1 className="text-[22px] font-semibold tracking-tight text-(--text)">
          {category.title}
        </h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          {category.description}
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {enabledPages.map((page, i) => (
          <GuideCard
            key={page.id}
            title={page.title}
            description={page.description}
            href={page.id}
            pageId={page.id}
            image={page.image || undefined}
            stagger={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
`;

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

// ---- Delete Page ----

async function deletePage() {
  const content = fs.readFileSync(PAGES_FILE, 'utf-8');
  const cats = parsePagesFile(content);

  if (cats.length === 0) {
    console.log(pc.yellow('⚠️  没有可用的分类。'));
    return;
  }

  type Step = 'category' | 'page' | 'confirm' | 'git-check' | 'done';
  let step: Step = 'category';

  let category: CategoryEntry | undefined;
  let targetPage: PageEntry | undefined;

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
        if (r.pages.length === 0) {
          console.log(pc.yellow('⚠️  该分类下没有页面。'));
          return;
        }
        category = r;
        step = 'page';
        break;
      }

      case 'page': {
        const r = await select<PageEntry | typeof BACK | typeof EXIT>({
          message: '选择要删除的页面:',
          options: [
            ...category!.pages.map((p) => ({
              value: p,
              label: `${p.id} ${pc.dim(p.enabled ? '(启用)' : '(禁用)')}`,
            })),
            { value: BACK, label: '← 返回上一步' },
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) { step = 'category'; break; }
        targetPage = r;
        step = 'confirm';
        break;
      }

      case 'confirm': {
        const r = await select<boolean | typeof BACK | typeof EXIT>({
          message: `确认删除页面 ${pc.red(`${category!.id}/${targetPage!.id}`)}?`,
          options: [
            { value: true, label: '确认删除' },
            { value: BACK, label: '← 返回上一步' },
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) { step = 'page'; break; }
        step = 'git-check';
        break;
      }

      case 'git-check': {
        if (!hasUncommittedChanges()) { step = 'done'; break; }
        const r = await select<string | typeof BACK | typeof EXIT>({
          message: pc.yellow('有未提交的 git 变更，继续删除可能丢失数据'),
          options: [
            { value: 'proceed', label: '仍然删除' },
            { value: BACK, label: '← 返回上一步' },
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) { step = 'confirm'; break; }
        step = 'done';
        break;
      }
    }
  }

  // Execute deletion
  const s = spinner();
  s.start('删除页面…');

  const pageDir = path.join(ROUTES_DIR, category!.id, targetPage!.id);
  if (fs.existsSync(pageDir)) {
    fs.rmSync(pageDir, { recursive: true, force: true });
  }

  const pageRegex = new RegExp(`\\n\\s+\\{\\s*id:\\s*'${targetPage!.id}'[^}]*\\},?`);
  const newContent = content.replace(pageRegex, '');
  fs.writeFileSync(PAGES_FILE, newContent, 'utf-8');

  s.stop(`页面 ${pc.red(`${category!.id}/${targetPage!.id}`)} 已删除`);

  runGenerate();
}

// ---- Delete Category ----

async function deleteCategory() {
  const content = fs.readFileSync(PAGES_FILE, 'utf-8');
  const cats = parsePagesFile(content);

  if (cats.length === 0) {
    console.log(pc.yellow('⚠️  没有可用的分类。'));
    return;
  }

  type Step = 'category' | 'confirm' | 'git-check' | 'done';
  let step: Step = 'category';

  let category: CategoryEntry | undefined;

  while (step !== 'done') {
    switch (step) {
      case 'category': {
        const r = await select<CategoryEntry | typeof EXIT>({
          message: '选择要删除的分类:',
          options: [
            ...cats.map((c) => ({
              value: c,
              label: `${c.title} (${c.id}) — ${c.pages.length} 个页面`,
            })),
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        category = r;

        if (category.pages.length > 0) {
          console.log(pc.yellow(`⚠️  该分类包含 ${category.pages.length} 个页面，删除分类将同时删除所有页面文件。`));
          console.log(pc.dim(`  页面: ${category.pages.map((p) => p.id).join(', ')}`));
        }

        step = 'confirm';
        break;
      }

      case 'confirm': {
        const r = await select<boolean | typeof BACK | typeof EXIT>({
          message: `确认删除分类 ${pc.red(category!.id)}? 此操作不可恢复`,
          options: [
            { value: true, label: '确认删除' },
            { value: BACK, label: '← 返回上一步' },
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) { step = 'category'; break; }
        step = 'git-check';
        break;
      }

      case 'git-check': {
        if (!hasUncommittedChanges()) { step = 'done'; break; }
        const r = await select<string | typeof BACK | typeof EXIT>({
          message: pc.yellow('有未提交的 git 变更，继续删除可能丢失数据'),
          options: [
            { value: 'proceed', label: '仍然删除' },
            { value: BACK, label: '← 返回上一步' },
            { value: EXIT, label: '← 返回首页' },
          ],
        });
        if (isCancel(r) || r === EXIT) return;
        if (r === BACK) { step = 'confirm'; break; }
        step = 'done';
        break;
      }
    }
  }

  const s = spinner();
  s.start('删除分类…');

  const catDir = path.join(ROUTES_DIR, category!.id);
  if (fs.existsSync(catDir)) {
    fs.rmSync(catDir, { recursive: true, force: true });
  }

  const catRegex = new RegExp(`\\{\\s*\\n\\s+id:\\s*'${category!.id}'[\\s\\S]*?\\n\\s+\\},?\\n`);
  const newContent = content.replace(catRegex, '');
  fs.writeFileSync(PAGES_FILE, newContent, 'utf-8');

  s.stop(`分类 ${pc.red(category!.id)} 已删除`);

  runGenerate();
}

// ---- Main ----

async function main() {
  intro(pc.bgCyan(' 页面/分类管理 '));

  while (true) {
    const action = await select({
      message: '请选择操作:',
      options: [
        { value: 'add-page', label: '新增页面' },
        { value: 'add-category', label: '新增分类' },
        { value: 'delete-page', label: '删除页面' },
        { value: 'delete-category', label: '删除分类' },
        { value: 'exit', label: '退出' },
      ],
    });
    if (isCancel(action) || action === 'exit') break;

    switch (action) {
      case 'add-page':
        await addPage();
        break;
      case 'add-category':
        await addCategory();
        break;
      case 'delete-page':
        await deletePage();
        break;
      case 'delete-category':
        await deleteCategory();
        break;
    }
  }

  outro('再见!');
}

main().catch((err) => { console.error(err); process.exit(1); });
