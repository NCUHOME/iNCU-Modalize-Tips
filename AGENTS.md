# 项目约定

## 技术栈

| 项目     | 说明                                  |
| -------- | ------------------------------------- |
| 包管理器 | **pnpm**                              |
| 框架     | React Router v7（SSR 关闭，SSG 模式） |
| 构建     | Vite                                  |
| 其他     | `mincu-react`（南大家园App js api）   |
| 语言     | TypeScript（strict 模式）             |
| 路径别名 | `~/` → `app/`                         |

## 常用命令

```bash
pnpm dev          # 开发服务器
pnpm build        # 生成路由 → 构建
pnpm generate     # 仅生成路由清单（不构建）
pnpm typecheck    # 类型检查（无错误时不输出）
pnpm cli          # CLI 工具（页面增删改查）
```

## CLI 工具

`pnpm cli` 用于页面骨架管理，完整命令参考见 **[docs/CLI.md](docs/CLI.md)**。

核心概念：

- **category**（分类）= 有`add-widget-guide`、`widget-troubleshoot`等
- **page**（页面）= 品牌 ID（如 `ios`、`hyperos`、`android`）
- 先用 CLI 建骨架，再按 skill 规范填充内容

## Skills

本项目使用 Agent Skills 存放专项知识，详见各个 skill 目录：

| Skill            | 路径                                        |
| ---------------- | ------------------------------------------- |
| 路由文档写作规范 | `.agents/skills/route-doc-writing/SKILL.md` |

## 文档风格

- 中文 UI 文本直接写在 JSX 中
- App 名称 / UI 标签用 `<strong>` 包裹（strong 前后各一个空格）
- 图片统一 `.webp`，非 webp 必须提醒用户，用 `<Image>` / `<Gallery>` 组件
- 路径分隔符 `→`（前后各一个空格）

## 代码风格

- tailwind 只在临时需要或组件中使用，全局样式写在 `app/app.css`
- 不做可能影响SSG的处理
