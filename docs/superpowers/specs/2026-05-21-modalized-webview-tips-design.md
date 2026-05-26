# ModalizedWebView Tips 设计文档

## 背景

在某个应用内以 ModalizedWebView 展示引导和排障内容，例如"如何添加小组件"、"小组件不刷新排障"等。初期面向 iOS、HyperOS、OriginOS 等多系统，但大多数系统内容尚未就绪。

## 核心需求

1. **路由文件自描述元数据**：每个路由文件自带 `routeMeta`（存在单独的 `.meta.ts` 中），不依赖外部配置文件
2. **预构建脚本提取**：`react-router build` 前扫描所有 `.meta.ts`，生成统一的 `app/generated/pages.ts`
3. **Config 控制启用**：`enabled: boolean` 决定页面是否可用，禁用页面自动 `clientLoader` redirect 到上级
4. **首页列表动态生成**：`/` 路由自动列出所有已启用页面，数据来自生成文件
5. **二级路由相通**：同一分类内的页面可互相导航
6. **三级路由返回按钮**：分类内具体页面（如 `/add-widget-guide/ios`）左上角显示返回按钮
7. **Prerendering**：所有启用页面在构建时渲染为真实 HTML，非空白壳

## 分类与页面

### 分类 1：如何添加小组件引导 (`add-widget-guide`)

| 页面 ID   | 系统      | 启用 |
| --------- | --------- | ---- |
| ios       | iOS       | ✅   |
| hyperos   | HyperOS   | ✅   |
| originos  | OriginOS  | ❌   |
| vivo      | vivo      | ❌   |
| harmonyos | HarmonyOS | ❌   |
| coloros   | ColorOS   | ❌   |
| magicos   | MagicOS   | ❌   |
| flyme     | Flyme     | ❌   |

### 分类 2：小组件不刷新排障 (`widget-troubleshoot`)

仅 Android 系（iOS 无此问题）：

| 页面 ID   | 系统      | 启用 |
| --------- | --------- | ---- |
| hyperos   | HyperOS   | ✅   |
| originos  | OriginOS  | ❌   |
| vivo      | vivo      | ❌   |
| harmonyos | HarmonyOS | ❌   |
| coloros   | ColorOS   | ❌   |
| magicos   | MagicOS   | ❌   |
| flyme     | Flyme     | ❌   |

## 项目结构

```
app/
  generated/
    pages.ts                   ← 自动生成，不手动编辑
  pages.ts                     ← 分类级别定义（名称、描述、排序）
  routes.ts                    ← 从 generated/pages.ts 生成路由树
  root.tsx                     ← 根布局
  app.css                      ← 样式
  routes/
    home.tsx                   ← / 首页列表
    redirect-page.tsx          ← 禁用页面的共享 redirect 组件
    add-widget-guide/
      layout.tsx               ← 分类布局（含返回按钮逻辑）
      index.tsx                ← /add-widget-guide/ OS 列表
      ios.tsx                  ← /add-widget-guide/ios
      ios.meta.ts              ← 页面元数据
      hyperos.tsx
      hyperos.meta.ts
      originos.meta.ts          ← enabled: false，路由走 redirect-page.tsx
      ...其他系统（仅 .meta.ts，无需 .tsx）
    widget-troubleshoot/
      layout.tsx
      index.tsx
      hyperos.tsx
      hyperos.meta.ts
      originos.meta.ts          ← enabled: false，路由走 redirect-page.tsx
      ...其他系统（仅 .meta.ts，无需 .tsx）
      ...
scripts/
  generate-pages.ts            ← 预构建脚本
```

## 元数据格式

### `app/pages.ts` — 分类定义

```ts
export const categories = [
  {
    id: "add-widget-guide",
    title: "如何添加小组件引导",
    description: "根据您的手机系统，了解如何将小组件添加到主屏幕",
    order: 1,
  },
  {
    id: "widget-troubleshoot",
    title: "小组件不刷新排障",
    description: "解决因系统后台限制导致的小组件不刷新问题",
    order: 2,
  },
] as const;
```

### `xxx.meta.ts` — 页面元数据（每个页面一个）

```ts
// routes/add-widget-guide/ios.meta.ts
export const routeMeta = {
  title: "iOS 添加小组件",
  description: "在 iPhone 或 iPad 上通过编辑主屏幕添加小组件",
  enabled: true,
} as const;
```

禁用的页面：

```ts
// routes/add-widget-guide/originos.meta.ts
export const routeMeta = {
  title: "OriginOS 添加小组件",
  description: "在 vivo OriginOS 系统中添加小组件",
  enabled: false,
} as const;
```

## 预构建脚本 (`scripts/generate-pages.ts`)

### 流程

1. 读取 `app/pages.ts` 获取分类定义
2. 使用 `tinyglobby` 扫描 `app/routes/**/*.meta.ts`
3. 动态 `import()` 每个 `.meta.ts`（纯数据文件，可在 Node 安全加载）
4. 按分类组织元数据
5. 写入 `app/generated/pages.ts`

### 生成的 `app/generated/pages.ts`

```ts
// 自动生成 — 不要手动编辑
export const routeManifest = {
  categories: [
    {
      id: "add-widget-guide",
      title: "如何添加小组件引导",
      description: "根据您的手机系统...",
      order: 1,
      pages: [
        {
          id: "ios",
          title: "iOS 添加小组件",
          description: "在 iPhone 或 iPad 上...",
          path: "/add-widget-guide/ios",
          enabled: true,
        },
        // ...
      ],
    },
    // ...
  ],
} as const;
```

## 路由生成 (`app/routes.ts`)

```ts
import { type RouteConfig, route, index } from "@react-router/dev/routes";
import { routeManifest } from "./generated/pages";

const pageRoutes: RouteConfig = [index("routes/home.tsx")];

for (const category of routeManifest.categories) {
  const children = [index(`routes/${category.id}/index.tsx`)];

  for (const page of category.pages) {
    if (!page.enabled) {
      // 禁用页面 → 共享 redirect 组件
      children.push(route(page.id, "routes/redirect-page.tsx"));
      continue;
    }
    children.push(route(page.id, `routes/${category.id}/${page.id}.tsx`));
  }

  pageRoutes.push(
    route(category.id, `routes/${category.id}/layout.tsx`, children),
  );
}

export default pageRoutes;
```

生成的 URL 结构：

```
/                              → home.tsx
/add-widget-guide              → layout.tsx + index.tsx
/add-widget-guide/ios          → layout.tsx + ios.tsx
/add-widget-guide/hyperos      → layout.tsx + hyperos.tsx
/add-widget-guide/originos     → layout.tsx + redirect-page.tsx (disabled)
/widget-troubleshoot           → layout.tsx + index.tsx
/widget-troubleshoot/hyperos   → layout.tsx + hyperos.tsx
```

## 路由深度与返回按钮

实现方式：在 `CategoryLayout` 中判断当前是否为 index 路由。

```tsx
// routes/add-widget-guide/layout.tsx
import { Outlet, useMatches, Link } from "react-router";

export default function CategoryLayout() {
  const matches = useMatches();
  const isIndex = matches[matches.length - 1].id.endsWith("/index");

  return (
    <div className="p-4">
      {!isIndex && (
        <Link to=".." relative="path" className="...">
          ← 返回
        </Link>
      )}
      <Outlet />
    </div>
  );
}
```

| 路径                    | 匹配深度              | 是否为 index  | 显示返回 |
| ----------------------- | --------------------- | ------------- | -------- |
| `/`                     | root + home           | home 是 index | ❌       |
| `/add-widget-guide`     | root + layout + index | ✅            | ❌       |
| `/add-widget-guide/ios` | root + layout + ios   | ❌            | ✅       |

## 禁用页面跳转

`routes/redirect-page.tsx` 通过 `clientLoader` 跳转到上级目录：

```tsx
import { redirect } from "react-router";
import type { Route } from "./+types/redirect-page";

export function clientLoader({}: Route.ClientLoaderArgs) {
  const path = window.location.pathname;
  const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";
  return redirect(parentPath);
}

export default function RedirectPage() {
  return null;
}
```

## Prerendering 配置

`react-router.config.ts` 动态生成 prerender 路径：

```ts
import type { Config } from "@react-router/dev/config";
import { routeManifest } from "./app/generated/pages";

export default {
  ssr: false,
  get prerender() {
    const paths: string[] = ["/"];
    for (const cat of routeManifest.categories) {
      paths.push(`/${cat.id}/`);
      for (const page of cat.pages) {
        if (page.enabled) paths.push(`/${cat.id}/${page.id}`);
      }
    }
    return paths;
  },
} satisfies Config;
```

## npm scripts

```json
{
  "scripts": {
    "generate": "tsx scripts/generate-pages.ts",
    "dev": "npm run generate && react-router dev",
    "build": "npm run generate && react-router build",
    "typecheck": "npm run generate && react-router typegen && tsc"
  }
}
```

## 新增页面流程

1. 创建 `<page-id>.meta.ts` — 写 title、description、enabled
2. 创建 `<page-id>.tsx` — 写页面内容
3. 运行 `npm run generate` → 自动更新路由树、首页列表、prerender 路径

不再需要手动编辑任何配置。

## 技术依赖

- `tinyglobby` — 已存在于 `@react-router/dev` 依赖树中
- `tsx` — 运行 TypeScript 预构建脚本，需安装 devDependency
