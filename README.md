# iNCU Modalize Tips

在应用内以 ModalizedWebView 展示引导和排障内容，如"如何添加小组件"、"小组件不刷新排障"等。

## 项目结构

```
app/
  pages.ts              ← 全局配置：分类、页面定义、启用开关
  routes.ts             ← 从 generated/pages.ts 动态生成路由树
  generated/
    pages.ts            ← 自动生成，不要手动编辑
  routes/
    home.tsx            ← 首页列表
    redirect-page.tsx   ← 禁用页面的共享 redirect 组件
    {category}/
      layout.tsx        ← 分类布局（含返回按钮）
      index.tsx         ← 分类内 OS 列表
      {page}/
        meta.ts         ← 页面元数据（title, description）
        page.tsx        ← 页面内容
scripts/
  generate-pages.ts     ← 预构建脚本
```

## 快速开始

```bash
pnpm install
pnpm dev       # 开发服务器（自动生成 manifest + HMR）
pnpm build     # 生产构建（自动生成 manifest + prerender）
pnpm start     # 预览构建结果（静态文件服务器，端口 3000）
```

## 页面开关

所有页面的启用状态集中在 [app/pages.ts](app/pages.ts) 控制：

```ts
pages: [
  { id: 'ios', enabled: true },
  { id: 'originos', enabled: false },
],
```

`enabled: false` 的页面：

- 不会出现在首页和分类列表中
- 路由存在但自动 redirect 到上级页面
- 不会被 prerender

## 新增页面

1. 在对应分类下创建 `{pageId}/meta.ts`：

```ts
export const routeMeta = {
  title: '页面标题',
  description: '简短描述',
} as const;
```

2. 创建 `{pageId}/page.tsx` 编写内容
3. 在 [app/pages.ts](app/pages.ts) 的对应分类 `pages` 数组中添加 `{ id: 'pageId', enabled: true/false }`
4. 运行 `pnpm build`

## 新增分类

1. 创建 `app/routes/{category}/layout.tsx` 和 `index.tsx`
2. 在 [app/pages.ts](app/pages.ts) 的 `categories` 数组中添加新分类定义
3. 按上述步骤添加页面

## 技术栈

- React Router v7（framework mode, `ssr: false`, `prerender: true`）
- Tailwind CSS v4
- TypeScript
- `tsx` — 运行预构建脚本
