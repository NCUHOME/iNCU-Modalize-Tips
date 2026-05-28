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
  cli.ts                ← 交互式 CLI（管理页面和分类）
  dev.ts                ← 开发入口（生成 + 监听 + dev server）
  generate-pages.ts     ← 预构建脚本（支持 --watch 模式）
  commands/             ← CLI 子命令模块
```

## 快速开始

```bash
pnpm install
pnpm cli        # 交互式管理 CLI
pnpm dev        # 开发服务器（生成 manifest + 监听文件变更 + HMR）
pnpm build      # 生产构建（自动生成 manifest + prerender）
pnpm preview    # 预览构建结果（端口 3000）
```

### 开发说明

`pnpm dev` 会依次执行：首次生成 manifest、后台监听文件变更、前台启动 dev server。修改任何文件都会自动触发对应更新，无需手动操作。

## 交互式 CLI

```bash
pnpm cli
```

提供完整的页面和分类管理功能，所有变更自动更新 `pages.ts` 并重新生成 manifest。

- **新增页面/分类** — 自动生成对应文件并注册到配置
- **一键添加** — 自动检测缺失品牌并批量添加
- **管理子菜单** — 开启停用页面、编辑标题描述、调整排序、删除页面/分类（删除前检查 git 变更并二次确认）
- **迁移页面** — 将页面移到另一个分类
- **健康检查** — 扫描孤立文件与缺失元数据

非交互式（Agent）模式及完整命令参考见 [docs/CLI.md](docs/CLI.md)。

## 页面开关

所有页面的启用状态集中在 [app/pages.ts](app/pages.ts) 控制：

```ts
pages: [
  { id: 'ios', enabled: true },
  { id: 'originos', enabled: false },
],
```

`enabled: false` 的页面不会出现在列表中、路由存在但自动 redirect、不会被 prerender。也可以用 CLI 的"启停页面"来切换。

## 新增页面（手动）

1. 在对应分类下创建 `{pageId}/meta.ts`：

```ts
export const routeMeta = {
  title: "页面标题",
  description: "简短描述",
  image: "/images/xxx.webp",
  updatedAt: "2026年5月",
} as const;
```

2. 创建 `{pageId}/page.tsx` 编写内容
3. 在 [app/pages.ts](app/pages.ts) 的对应分类 `pages` 数组中添加 `{ id: 'pageId', enabled: true/false }`
4. 运行 `pnpm generate`

## 新增分类（手动）

1. 创建 `app/routes/{category}/layout.tsx` 和 `index.tsx`
2. 在 [app/pages.ts](app/pages.ts) 的 `categories` 数组中添加新分类定义
3. 按上述步骤添加页面

## 技术栈

- React Router v7（framework mode, `ssr: false`, `prerender: true`）
- Tailwind CSS v4
- TypeScript
- `@clack/prompts` + `picocolors` — CLI 交互界面
- `tsx` — 运行脚本
