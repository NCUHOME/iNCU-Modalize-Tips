# ModalizedWebView Tips Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a prerendered SPA for displaying widget-add guides and troubleshooting tips in a ModalizedWebView, with route-file-owned metadata extracted via a prebuild script.

**Architecture:** Route modules export metadata via `.meta.ts` sidecar files (pure data, no React). A prebuild script (`tsx scripts/generate-pages.ts`) scans all `.meta.ts` files and generates `app/generated/pages.ts`. The route config (`routes.ts`), homepage (`home.tsx`), and prerender config all consume the generated manifest. Disabled pages use a `clientLoader` redirect to the parent section.

**Tech Stack:** React Router v7 (framework mode, `ssr: false`, `prerender: true`), Tailwind CSS v4, TypeScript, `tsx` for prebuild script.

---

### Task 1: Install tsx & create directories

**Files:**
- Create: `scripts/` directory
- Create: `app/generated/` directory
- Create: `app/routes/add-widget-guide/`
- Create: `app/routes/widget-troubleshoot/`

- [ ] **Step 1: Install tsx**

Run:
```bash
pnpm add -D tsx
```

Expected output: package added to devDependencies.

- [ ] **Step 2: Create directory structure**

Run:
```bash
mkdir -p app/generated scripts app/routes/add-widget-guide app/routes/widget-troubleshoot
```

Expected output: directories exist.

- [ ] **Step 3: Commit**

```bash
git add pnpm-lock.yaml package.json
git commit -m "chore: add tsx for prebuild script"
```

---

### Task 2: Create `app/pages.ts` (category definitions)

**Files:**
- Create: `app/pages.ts`

This file defines the category hierarchy (what categories exist, what page IDs belong to each category, and their display order). Individual page metadata (title, description, enabled) comes from `.meta.ts` files.

- [ ] **Step 1: Write app/pages.ts**

```ts
export interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  order: number;
  pageIds: readonly string[];
}

export const categories = [
  {
    id: 'add-widget-guide',
    title: '如何添加小组件引导',
    description: '根据您的手机系统，了解如何将小组件添加到主屏幕',
    order: 1,
    pageIds: [
      'ios',
      'hyperos',
      'originos',
      'vivo',
      'harmonyos',
      'coloros',
      'magicos',
      'flyme',
    ] as const,
  },
  {
    id: 'widget-troubleshoot',
    title: '小组件不刷新排障',
    description: '解决因系统后台限制导致的小组件不刷新问题',
    order: 2,
    pageIds: [
      'hyperos',
      'originos',
      'vivo',
      'harmonyos',
      'coloros',
      'magicos',
      'flyme',
    ] as const,
  },
] as const;
```

- [ ] **Step 2: Commit**

```bash
git add app/pages.ts
git commit -m "feat: add category definitions"
```

---

### Task 3: Create `.meta.ts` files for all pages

**Files:**
- Create: `app/routes/add-widget-guide/ios.meta.ts`
- Create: `app/routes/add-widget-guide/hyperos.meta.ts`
- Create: `app/routes/add-widget-guide/originos.meta.ts`
- Create: `app/routes/add-widget-guide/vivo.meta.ts`
- Create: `app/routes/add-widget-guide/harmonyos.meta.ts`
- Create: `app/routes/add-widget-guide/coloros.meta.ts`
- Create: `app/routes/add-widget-guide/magicos.meta.ts`
- Create: `app/routes/add-widget-guide/flyme.meta.ts`
- Create: `app/routes/widget-troubleshoot/hyperos.meta.ts`
- Create: `app/routes/widget-troubleshoot/originos.meta.ts`
- Create: `app/routes/widget-troubleshoot/vivo.meta.ts`
- Create: `app/routes/widget-troubleshoot/harmonyos.meta.ts`
- Create: `app/routes/widget-troubleshoot/coloros.meta.ts`
- Create: `app/routes/widget-troubleshoot/magicos.meta.ts`
- Create: `app/routes/widget-troubleshoot/flyme.meta.ts`

Each `.meta.ts` is a pure data file (zero React imports) that exports a `routeMeta` constant.

- [ ] **Step 1: Create enabled page metas**

```ts
// app/routes/add-widget-guide/ios.meta.ts
export const routeMeta = {
  title: 'iOS 添加小组件',
  description: '在 iPhone 或 iPad 上通过编辑主屏幕添加小组件',
  enabled: true,
} as const;
```

```ts
// app/routes/add-widget-guide/hyperos.meta.ts
export const routeMeta = {
  title: 'HyperOS 添加小组件',
  description: '在 Xiaomi HyperOS 系统中将小组件添加到主屏幕',
  enabled: true,
} as const;
```

```ts
// app/routes/widget-troubleshoot/hyperos.meta.ts
export const routeMeta = {
  title: 'HyperOS 排障',
  description: '解决 HyperOS 系统中小组件不刷新问题',
  enabled: true,
} as const;
```

- [ ] **Step 2: Create disabled page metas (add-widget-guide)**

```ts
// app/routes/add-widget-guide/originos.meta.ts
export const routeMeta = {
  title: 'OriginOS 添加小组件',
  description: '在 vivo OriginOS 系统中添加小组件',
  enabled: false,
} as const;
```

```ts
// app/routes/add-widget-guide/vivo.meta.ts
export const routeMeta = {
  title: 'Vivo 添加小组件',
  description: '在 Vivo 手机中添加小组件',
  enabled: false,
} as const;
```

```ts
// app/routes/add-widget-guide/harmonyos.meta.ts
export const routeMeta = {
  title: 'HarmonyOS 添加小组件',
  description: '在华为 HarmonyOS 系统中添加小组件',
  enabled: false,
} as const;
```

```ts
// app/routes/add-widget-guide/coloros.meta.ts
export const routeMeta = {
  title: 'ColorOS 添加小组件',
  description: '在 OPPO ColorOS 系统中添加小组件',
  enabled: false,
} as const;
```

```ts
// app/routes/add-widget-guide/magicos.meta.ts
export const routeMeta = {
  title: 'MagicOS 添加小组件',
  description: '在荣耀 MagicOS 系统中添加小组件',
  enabled: false,
} as const;
```

```ts
// app/routes/add-widget-guide/flyme.meta.ts
export const routeMeta = {
  title: 'Flyme 添加小组件',
  description: '在魅族 Flyme 系统中添加小组件',
  enabled: false,
} as const;
```

- [ ] **Step 3: Create disabled page metas (widget-troubleshoot)**

```ts
// app/routes/widget-troubleshoot/originos.meta.ts
export const routeMeta = {
  title: 'OriginOS 排障',
  description: '解决 OriginOS 系统中小组件不刷新问题',
  enabled: false,
} as const;
```

```ts
// app/routes/widget-troubleshoot/vivo.meta.ts
export const routeMeta = {
  title: 'Vivo 排障',
  description: '解决 Vivo 手机中小组件不刷新问题',
  enabled: false,
} as const;
```

```ts
// app/routes/widget-troubleshoot/harmonyos.meta.ts
export const routeMeta = {
  title: 'HarmonyOS 排障',
  description: '解决 HarmonyOS 系统中小组件不刷新问题',
  enabled: false,
} as const;
```

```ts
// app/routes/widget-troubleshoot/coloros.meta.ts
export const routeMeta = {
  title: 'ColorOS 排障',
  description: '解决 ColorOS 系统中小组件不刷新问题',
  enabled: false,
} as const;
```

```ts
// app/routes/widget-troubleshoot/magicos.meta.ts
export const routeMeta = {
  title: 'MagicOS 排障',
  description: '解决 MagicOS 系统中小组件不刷新问题',
  enabled: false,
} as const;
```

```ts
// app/routes/widget-troubleshoot/flyme.meta.ts
export const routeMeta = {
  title: 'Flyme 排障',
  description: '解决 Flyme 系统中小组件不刷新问题',
  enabled: false,
} as const;
```

- [ ] **Step 4: Commit**

```bash
git add app/routes/*/meta.ts
git commit -m "feat: add page metadata files"
```

---

### Task 4: Create `scripts/generate-pages.ts`

**Files:**
- Create: `scripts/generate-pages.ts`

The script:
1. Reads `app/pages.ts` to get category definitions + page ID lists
2. Locates each `.meta.ts` by convention: `app/routes/{categoryId}/{pageId}.meta.ts`
3. Dynamically imports each `.meta.ts` (pure data, no React — safe for Node.js with tsx)
4. Merges category structure with page metadata
5. Writes `app/generated/pages.ts`

- [ ] **Step 1: Write scripts/generate-pages.ts**

```ts
#!/usr/bin/env tsx
import { glob } from 'tinyglobby';
import path from 'path';
import fs from 'fs';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '..');
const APP_DIR = path.join(PROJECT_ROOT, 'app');
const OUTPUT_DIR = path.join(APP_DIR, 'generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'pages.ts');

type RouteMeta = {
  title: string;
  description: string;
  enabled: boolean;
};

type PageInfo = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  path: string;
};

type CategoryInfo = {
  id: string;
  title: string;
  description: string;
  order: number;
  pages: PageInfo[];
};

type RouteManifest = {
  categories: CategoryInfo[];
};

function formatPath(categoryId: string, pageId: string): string {
  return `/${categoryId}/${pageId}`;
}

async function main() {
  // Step 1: Read category definitions from app/pages.ts
  const pagesModulePath = path.join(APP_DIR, 'pages.ts');
  const pagesModule = await import(pagesModulePath);

  const categories: typeof pagesModule.categories = pagesModule.categories;

  // Step 2: For each (category, pageId), read the corresponding .meta.ts
  const manifest: RouteManifest = { categories: [] as CategoryInfo[] };

  for (const category of categories) {
    const pages: PageInfo[] = [];

    for (const pageId of category.pageIds) {
      const metaFilePath = path.join(
        APP_DIR,
        'routes',
        category.id,
        `${pageId}.meta.ts`,
      );

      if (!fs.existsSync(metaFilePath)) {
        console.warn(
          `⚠️  Missing meta file for ${category.id}/${pageId}, skipping.`,
        );
        continue;
      }

      const metaModule = await import(metaFilePath);
      const meta = metaModule.routeMeta as RouteMeta;

      pages.push({
        id: pageId,
        title: meta.title,
        description: meta.description,
        enabled: meta.enabled,
        path: formatPath(category.id, pageId),
      });
    }

    manifest.categories.push({
      id: category.id,
      title: category.title,
      description: category.description,
      order: category.order,
      pages,
    });
  }

  // Step 3: Generate output file
  const output = `// Auto-generated by scripts/generate-pages.ts — do not edit manually
export const routeManifest = ${JSON.stringify(manifest, null, 2)} as const;
`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  const totalPages = manifest.categories.reduce(
    (sum, c) => sum + c.pages.length,
    0,
  );
  const enabledPages = manifest.categories.reduce(
    (sum, c) => sum + c.pages.filter((p: PageInfo) => p.enabled).length,
    0,
  );

  console.log(
    `✅ Generated manifest: ${manifest.categories.length} categories, ${totalPages} pages (${enabledPages} enabled)`,
  );
}

main().catch(console.error);
```

Note: `import.meta.dirname` requires Node.js 21+. If the project uses an older Node version, use this instead:
```ts
const PROJECT_ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
```

- [ ] **Step 2: Verify script runs**

Run:
```bash
pnpm tsx scripts/generate-pages.ts
```

Expected output:
```
✅ Generated manifest: 2 categories, 15 pages (3 enabled)
```

(15 = 7 widget-troubleshoot pages + 8 add-widget-guide pages; 3 enabled = ios-guide, hyperos-guide, hyperos-troubleshoot)

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-pages.ts
git commit -m "feat: add prebuild script for page manifest generation"
```

---

### Task 5: Create `app/generated/pages.ts` (first-run generation)

**Files:**
- Create: `app/generated/pages.ts` (via running the prebuild script)

- [ ] **Step 1: Run the generate script**

Run:
```bash
pnpm tsx scripts/generate-pages.ts
```

Verify the generated file exists. Read its content to confirm the structure is correct.

```bash
cat app/generated/pages.ts
```

Expected content (partial):
```ts
// Auto-generated by scripts/generate-pages.ts — do not edit manually
export const routeManifest = {
  "categories": [
    {
      "id": "add-widget-guide",
      // ...
    },
  ],
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add -f app/generated/pages.ts
git commit -m "feat: add initial generated manifest"
```

Note: `-f` is needed because `app/generated/` may be in `.gitignore` later.

---

### Task 6: Update `app/routes.ts` for dynamic route generation

**Files:**
- Modify: `app/routes.ts`

- [ ] **Step 1: Rewrite app/routes.ts**

```ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";
import { routeManifest } from "./generated/pages";

const routes: RouteConfig = [index("routes/home.tsx")];

for (const category of routeManifest.categories) {
  const children: RouteConfig = [
    index(`routes/${category.id}/index.tsx`),
  ];

  for (const page of category.pages) {
    if (page.enabled) {
      children.push(
        route(page.id, `routes/${category.id}/${page.id}.tsx`),
      );
    } else {
      // Disabled pages redirect to parent via shared redirect component
      children.push(
        route(page.id, "routes/redirect-page.tsx"),
      );
    }
  }

  routes.push(
    route(category.id, `routes/${category.id}/layout.tsx`, children),
  );
}

export default routes satisfies RouteConfig;
```

- [ ] **Step 2: Commit**

```bash
git add app/routes.ts
git commit -m "feat: dynamic route generation from manifest"
```

---

### Task 7: Update `react-router.config.ts` for prerender paths

**Files:**
- Modify: `react-router.config.ts`

- [ ] **Step 1: Update react-router.config.ts**

```ts
import type { Config } from "@react-router/dev/config";
import { routeManifest } from "./app/generated/pages";

export default {
  ssr: false,
  get prerender() {
    const paths: string[] = ["/"];
    for (const category of routeManifest.categories) {
      paths.push(`/${category.id}/`);
      for (const page of category.pages) {
        if (page.enabled) paths.push(page.path);
      }
    }
    return paths;
  },
} satisfies Config;
```

- [ ] **Step 2: Commit**

```bash
git add react-router.config.ts
git commit -m "feat: dynamic prerender paths from manifest"
```

---

### Task 8: Create shared redirect component

**Files:**
- Create: `app/routes/redirect-page.tsx`

- [ ] **Step 1: Write redirect-page.tsx**

```tsx
import { redirect } from "react-router";
import type { Route } from "./+types/redirect-page";

export function clientLoader({}: Route.ClientLoaderArgs) {
  const path = window.location.pathname;
  // Extract parent path: /category/page → /category
  const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";
  return redirect(parentPath);
}

export default function RedirectPage() {
  // The clientLoader redirect runs before this renders
  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/routes/redirect-page.tsx
git commit -m "feat: add shared redirect component for disabled pages"
```

---

### Task 9: Create category layouts (with back button)

**Files:**
- Create: `app/routes/add-widget-guide/layout.tsx`
- Create: `app/routes/widget-troubleshoot/layout.tsx`

Both layouts are identical in structure — only the styling content differs.

- [ ] **Step 1: Create add-widget-guide layout**

```tsx
import { Outlet, useMatches, Link } from "react-router";

export default function AddWidgetGuideLayout() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const isIndex = lastMatch.id.endsWith("/index");

  return (
    <div className="min-h-screen p-5">
      {!isIndex && (
        <Link
          to=".."
          relative="path"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回
        </Link>
      )}
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 2: Create widget-troubleshoot layout**

```tsx
import { Outlet, useMatches, Link } from "react-router";

export default function WidgetTroubleshootLayout() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const isIndex = lastMatch.id.endsWith("/index");

  return (
    <div className="min-h-screen p-5">
      {!isIndex && (
        <Link
          to=".."
          relative="path"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回
        </Link>
      )}
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/routes/*/layout.tsx
git commit -m "feat: add category layouts with back button"
```

---

### Task 10: Create category index pages (OS selection list)

**Files:**
- Create: `app/routes/add-widget-guide/index.tsx`
- Create: `app/routes/widget-troubleshoot/index.tsx`

Each index page lists the enabled OS options for that category, dynamically from the manifest.

- [ ] **Step 1: Create add-widget-guide index page**

```tsx
import { Link } from "react-router";
import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";

export function meta({}: Route.MetaArgs) {
  const category = routeManifest.categories.find(
    (c) => c.id === "add-widget-guide",
  );
  return [
    { title: category?.title ?? "如何添加小组件引导" },
    {
      name: "description",
      content: category?.description ?? "",
    },
  ];
}

export default function AddWidgetGuideIndex() {
  const category = routeManifest.categories.find(
    (c) => c.id === "add-widget-guide",
  );
  if (!category) return null;

  const enabledPages = category.pages.filter((p) => p.enabled);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">{category.title}</h1>
      <p className="text-neutral-500 text-sm mb-5">{category.description}</p>
      <div className="flex flex-col gap-3">
        {enabledPages.map((page) => (
          <Link
            key={page.id}
            to={page.id}
            className="block p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-colors"
          >
            <h2 className="font-medium">{page.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create widget-troubleshoot index page**

```tsx
import { Link } from "react-router";
import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";

export function meta({}: Route.MetaArgs) {
  const category = routeManifest.categories.find(
    (c) => c.id === "widget-troubleshoot",
  );
  return [
    { title: category?.title ?? "小组件不刷新排障" },
    {
      name: "description",
      content: category?.description ?? "",
    },
  ];
}

export default function WidgetTroubleshootIndex() {
  const category = routeManifest.categories.find(
    (c) => c.id === "widget-troubleshoot",
  );
  if (!category) return null;

  const enabledPages = category.pages.filter((p) => p.enabled);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">{category.title}</h1>
      <p className="text-neutral-500 text-sm mb-5">{category.description}</p>
      <div className="flex flex-col gap-3">
        {enabledPages.map((page) => (
          <Link
            key={page.id}
            to={page.id}
            className="block p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-colors"
          >
            <h2 className="font-medium">{page.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/routes/*/index.tsx
git commit -m "feat: add category index pages with OS list"
```

---

### Task 11: Update home page (all pages list)

**Files:**
- Modify: `app/routes/home.tsx`

- [ ] **Step 1: Rewrite home page**

```tsx
import { Link } from "react-router";
import type { Route } from "./+types/home";
import { routeManifest } from "~/generated/pages";

export function meta({}: Route.MetaArgs) {
  const total = routeManifest.categories.reduce(
    (sum, c) => sum + c.pages.filter((p) => p.enabled).length,
    0,
  );
  return [
    { title: "使用指南" },
    {
      name: "description",
      content: `${routeManifest.categories.length} 个分类，${total} 个指南`,
    },
  ];
}

export default function Home() {
  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-6">使用指南</h1>
      <div className="flex flex-col gap-8">
        {routeManifest.categories.map((category) => {
          const enabledPages = category.pages.filter((p) => p.enabled);
          if (enabledPages.length === 0) return null;

          return (
            <section key={category.id}>
              <Link
                to={`/${category.id}/`}
                className="block mb-3"
              >
                <h2 className="text-lg font-medium text-neutral-900">
                  {category.title}
                </h2>
                <p className="text-sm text-neutral-500">
                  {category.description}
                </p>
              </Link>
              <div className="flex flex-col gap-2 ml-2">
                {enabledPages.map((page) => (
                  <Link
                    key={page.id}
                    to={page.path}
                    className="block p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 transition-colors"
                  >
                    <span className="font-medium text-sm">{page.title}</span>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {page.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/routes/home.tsx
git commit -m "feat: dynamic home page listing all categories and pages"
```

---

### Task 12: Create individual page components (enabled pages)

**Files:**
- Create: `app/routes/add-widget-guide/ios.tsx`
- Create: `app/routes/add-widget-guide/hyperos.tsx`
- Create: `app/routes/widget-troubleshoot/hyperos.tsx`

These are content pages. For now, they contain placeholder content that can be filled later.

- [ ] **Step 1: Create iOS guide page**

```tsx
import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/ios";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === "add-widget-guide")
    ?.pages.find((p) => p.id === "ios");
  return [
    { title: page?.title ?? "iOS 添加小组件" },
    { name: "description", content: page?.description ?? "" },
  ];
}

export default function IosGuide() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1>iOS 添加小组件</h1>
      <p className="text-neutral-500 text-sm">最后更新：2026 年 5 月</p>
      <div className="mt-6 space-y-4 text-neutral-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-neutral-900">操作步骤</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>长按主屏幕空白区域，进入编辑模式</li>
            <li>点击左上角的 <strong>+</strong> 按钮</li>
            <li>搜索或找到本应用的小组件</li>
            <li>选择合适的小组件尺寸</li>
            <li>点击 <strong>添加小组件</strong></li>
            <li>点击右上角 <strong>完成</strong> 退出编辑模式</li>
          </ol>
        </section>
        <section>
          <h2 className="text-base font-medium text-neutral-900">注意事项</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>确保 iOS 版本不低于 14.0</li>
            <li>如果找不到小组件，请确认应用已更新到最新版本</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Create HyperOS guide page**

```tsx
import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/hyperos";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === "add-widget-guide")
    ?.pages.find((p) => p.id === "hyperos");
  return [
    { title: page?.title ?? "HyperOS 添加小组件" },
    { name: "description", content: page?.description ?? "" },
  ];
}

export default function HyperosGuide() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1>HyperOS 添加小组件</h1>
      <p className="text-neutral-500 text-sm">最后更新：2026 年 5 月</p>
      <div className="mt-6 space-y-4 text-neutral-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-neutral-900">操作步骤</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>在主屏幕双指捏合或长按空白区域</li>
            <li>点击底部 <strong>添加工具</strong> 或 <strong>小组件</strong></li>
            <li>在小组件列表中找到本应用</li>
            <li>选择合适的小组件样式和尺寸</li>
            <li>点击 <strong>添加到主屏幕</strong></li>
          </ol>
        </section>
        <section>
          <h2 className="text-base font-medium text-neutral-900">注意事项</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>HyperOS 基于 Android，不同机型操作可能略有差异</li>
            <li>部分 MIUI 版本操作路径可能不同</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create HyperOS troubleshoot page**

```tsx
import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/hyperos";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === "widget-troubleshoot")
    ?.pages.find((p) => p.id === "hyperos");
  return [
    { title: page?.title ?? "HyperOS 排障" },
    { name: "description", content: page?.description ?? "" },
  ];
}

export default function HyperosTroubleshoot() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1>HyperOS 小组件不刷新排障</h1>
      <p className="text-neutral-500 text-sm">最后更新：2026 年 5 月</p>
      <div className="mt-6 space-y-4 text-neutral-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-neutral-900">检查步骤</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>
              <strong>关闭省电模式</strong>
              <p className="text-xs text-neutral-400 mt-0.5">
                设置 → 省电与电池 → 关闭省电模式
              </p>
            </li>
            <li>
              <strong>允许后台运行</strong>
              <p className="text-xs text-neutral-400 mt-0.5">
                设置 → 应用设置 → 本应用 → 省电策略 → 选择"无限制"
              </p>
            </li>
            <li>
              <strong>锁定应用</strong>
              <p className="text-xs text-neutral-400 mt-0.5">
                在多任务界面将本应用下拉锁定
              </p>
            </li>
            <li>
              <strong>重启小组件</strong>
              <p className="text-xs text-neutral-400 mt-0.5">
                移除小组件后重新添加
              </p>
            </li>
          </ol>
        </section>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/routes/*/ios.tsx app/routes/*/hyperos.tsx
git commit -m "feat: add content pages for enabled guides (iOS, HyperOS)"
```

---

### Task 13: Update package.json scripts + .gitignore

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Update package.json scripts**

Edit the `scripts` section:

```json
{
  "scripts": {
    "generate": "tsx scripts/generate-pages.ts",
    "dev": "pnpm generate && react-router dev",
    "build": "pnpm generate && react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "pnpm generate && react-router typegen && tsc"
  }
}
```

- [ ] **Step 2: Update .gitignore**

Append to `.gitignore`:

```
# Generated
app/generated/
```

- [ ] **Step 3: Commit**

```bash
git add package.json .gitignore
git commit -m "chore: add generate script and ignore generated files"
```

---

### Task 14: Build and verify

- [ ] **Step 1: Run full build**

```bash
pnpm build
```

Expected output:
```
✅ Generated manifest: 2 categories, 15 pages (3 enabled)
✔ Build complete
```

- [ ] **Step 2: Verify prerendered output**

Check that prerendered HTML files exist with actual content (not blank shells):

```bash
ls -la build/client/
```

Expected: `index.html`, `add-widget-guide/index.html`, `add-widget-guide/ios/index.html`, `add-widget-guide/hyperos/index.html`, `widget-troubleshoot/index.html`, `widget-troubleshoot/hyperos/index.html`

```bash
grep -c "iOS 添加小组件" build/client/add-widget-guide/ios/index.html
```

Expected output: `1` (the page title is prerendered in HTML)

- [ ] **Step 3: Verify disabled pages are NOT prerendered**

```bash
ls build/client/add-widget-guide/originos/ 2>&1 || echo "Not prerendered (expected)"
```

Expected: "Not prerendered (expected)"

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: initial build artifacts and configuration"
```

---

## Future: Adding a new page

When a new OS needs to be added:

1. Create `<page-id>.meta.ts` with `title`, `description`, `enabled: true/false`
2. Create `<page-id>.tsx` with the content component
3. Add `pageId` to the appropriate category in `app/pages.ts`
4. Run `pnpm generate` → manifest updates automatically
5. Run `pnpm build` → route, prerender, and list all update automatically
