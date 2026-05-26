#!/usr/bin/env tsx
import { intro, outro, select, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { addPage, addCategory } from "./commands/add";
import { toggleInCat } from "./commands/toggle";
import { sortInCat } from "./commands/sort";
import { editInCat } from "./commands/edit";
import {
  deleteFromManage,
  deletePage,
  deleteCategory,
} from "./commands/delete";
import { healthCheck } from "./commands/health";
import { migratePage } from "./commands/migrate";
import { batchAdd } from "./commands/batch-add";

// ---- Manage sub-menu ----

async function manageMenu() {
  while (true) {
    const action = await select<string>({
      message: "📋 管理操作:",
      options: [
        { value: "toggle", label: "🌕 启停页面", hint: "启用 / 停用页面" },
        { value: "edit", label: "✏️  编辑页面", hint: "修改标题 / 描述" },
        { value: "sort", label: "↕️  页面排序", hint: "调整页面顺序" },
        { value: "---1", label: pc.dim("─".repeat(36)) },
        { value: "del-pg", label: "🗑️  删除页面" },
        { value: "del-cat", label: "🗑️  删除分类" },
        { value: "---2", label: pc.dim("─".repeat(36)) },
        { value: "back", label: "← 返回主菜单" },
      ],
    });
    if (isCancel(action) || action === "back") return;
    if (action?.startsWith("---")) continue;

    switch (action) {
      case "toggle":
        await toggleInCat();
        break;
      case "edit":
        await editInCat();
        break;
      case "sort":
        await sortInCat();
        break;
      case "del-pg":
        await deleteFromManage();
        break;
      case "del-cat":
        await deleteCategory();
        break;
    }
  }
}

// ---- Main ----

async function main() {
  intro(pc.bgCyan(" 页面/分类管理 "));

  while (true) {
    const action = await select<string>({
      message: "请选择操作:",
      options: [
        {
          value: "add-page",
          label: "📝 新增页面",
          hint: "在已有分类下创建新页面",
        },
        { value: "add-cat", label: "📁 新增分类", hint: "创建新的页面分类" },
        {
          value: "batch-add",
          label: "⚡ 一键添加常见品牌",
          hint: "自动检测缺失品牌并批量添加",
        },
        {
          value: "manage",
          label: "📋 管理",
          hint: "启停 / 编辑 / 排序 / 删除",
        },
        {
          value: "migrate",
          label: "🔀 迁移页面",
          hint: "将页面移到另一个分类",
        },
        {
          value: "health",
          label: "🩺 健康检查",
          hint: "扫描孤立文件 & 缺失元数据",
        },
        { value: "exit", label: "退出" },
      ],
    });
    if (isCancel(action) || action === "exit") break;

    switch (action) {
      case "add-page":
        await addPage();
        break;
      case "add-cat":
        await addCategory();
        break;
      case "batch-add":
        await batchAdd();
        break;
      case "manage":
        await manageMenu();
        break;
      case "migrate":
        await migratePage();
        break;
      case "health":
        await healthCheck();
        break;
    }
  }

  outro("再见!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
