# CLI 命令参考

项目级 CLI 工具，用于页面骨架的增删改查。不带参数运行 `pnpm cli` 进入交互模式。

```bash
# 新增分类
pnpm cli add-cat --id new-guide --title "新手指南" --desc "描述"

# 新增页面（默认启用，--disabled 创建占位页，--image 可省略）
pnpm cli add-page --category add-widget-guide --page realme --title "Realme 添加小组件" --desc "步骤" --image "/images/realme.webp"

# 批量添加缺失品牌
pnpm cli batch-add --category add-widget-guide --desc "在{{title}}系统中添加小组件的步骤"

# 启停页面
pnpm cli toggle --category add-widget-guide --page realme

# 编辑 meta
pnpm cli edit --category add-widget-guide --page realme --title "新标题" --desc "新描述"

# 删除（加 --force 跳过 git 检查）
pnpm cli delete-page --category add-widget-guide --page realme --force
pnpm cli delete-cat --category old-guide --force

# 迁移页面
pnpm cli migrate --from add-widget-guide --to widget-troubleshoot --page realme

# 健康检查
pnpm cli health
```
