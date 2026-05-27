import pc from "picocolors";
import { addPageAgent, addCategoryAgent } from "./add";
import type { AddPageArgs, AddCategoryArgs } from "./add";

type Opts = Record<string, string | boolean>;

interface Command {
  required: string[];
  run: (o: Opts) => Promise<void>;
}

export const commands: Record<string, Command> = {
  "add-page": {
    required: ["category", "page", "title"],
    run: async (o) => {
      const key = await addPageAgent({
        category: o.category as string,
        page: o.page as string,
        title: o.title as string,
        desc: (o.desc as string) || "",
        image: (o.image as string) || undefined,
        enabled: !o.disabled,
      } as AddPageArgs);
      console.log(pc.green(`✅ 已创建页面 ${key}`));
    },
  },
  "add-cat": {
    required: ["id", "title"],
    run: async (o) => {
      const id = await addCategoryAgent({
        id: o.id as string,
        title: o.title as string,
        desc: (o.desc as string) || "",
        order: o.order ? Number(o.order) : undefined,
      } as AddCategoryArgs);
      console.log(pc.green(`✅ 已创建分类 ${id}`));
    },
  },
  "batch-add": {
    required: ["category"],
    run: async (o) => {
      const { batchAddAgent } = await import("./batch-add");
      const n = await batchAddAgent(
        o.category as string,
        (o.desc as string) || undefined,
      );
      console.log(pc.green(`✅ 批量添加完成，新增 ${n} 个页面`));
    },
  },
  toggle: {
    required: ["category", "page"],
    run: async (o) => {
      const { togglePageAgent } = await import("./toggle");
      const state = await togglePageAgent(
        o.category as string,
        o.page as string,
      );
      console.log(
        pc.green(`✅ ${o.category}/${o.page} → ${state ? "启用" : "禁用"}`),
      );
    },
  },
  edit: {
    required: ["category", "page"],
    run: async (o) => {
      const { editPageAgent } = await import("./edit");
      await editPageAgent(
        o.category as string,
        o.page as string,
        (o.title as string) || undefined,
        (o.desc as string) || undefined,
      );
      console.log(pc.green(`✅ ${o.category}/${o.page} 已更新`));
    },
  },
  "delete-page": {
    required: ["category", "page"],
    run: async (o) => {
      const { deletePageAgent } = await import("./delete");
      await deletePageAgent(o.category as string, o.page as string, !!o.force);
      console.log(pc.green(`✅ 已删除 ${o.category}/${o.page}`));
    },
  },
  "delete-cat": {
    required: ["category"],
    run: async (o) => {
      const { deleteCategoryAgent } = await import("./delete");
      await deleteCategoryAgent(o.category as string, !!o.force);
      console.log(pc.green(`✅ 已删除分类 ${o.category}`));
    },
  },
  migrate: {
    required: ["from", "to", "page"],
    run: async (o) => {
      const { migratePageAgent } = await import("./migrate");
      await migratePageAgent(
        o.from as string,
        o.to as string,
        o.page as string,
        !!o.force,
      );
      console.log(pc.green(`✅ 已迁移 ${o.page}: ${o.from} → ${o.to}`));
    },
  },
  health: {
    required: [],
    run: async (o) => {
      const { healthCheckAgent } = await import("./health");
      const issues = await healthCheckAgent(!!o.fix);
      if (issues.length === 0) {
        console.log(pc.green("✅ 无问题"));
      } else {
        for (const i of issues) console.log(i);
        if (o.fix) {
          console.log(pc.green(`✅ Fix 完成，已处理 ${issues.length} 个问题`));
        }
      }
    },
  },
};
