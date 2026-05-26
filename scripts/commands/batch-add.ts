import fs from "node:fs";
import path from "node:path";
import {
  select,
  multiselect,
  confirm,
  spinner,
  isCancel,
  note,
  text,
} from "@clack/prompts";
import pc from "picocolors";
import type { CategoryEntry } from "../lib/types";
import { EXIT, BACK, ROUTES_DIR } from "../lib/constants";
import { importPagesFile, writePages } from "../lib/pages";
import { applyTemplate, runGenerate, toPascalCase } from "../lib/utils";

// ---- 品牌数据（从模板文件加载） ----

interface BrandDef {
  id: string;
  title: string;
  image: string;
}

const TEMPLATES_DIR = path.resolve(import.meta.dirname, "../templates");

function loadBrands(): BrandDef[] {
  const raw = fs.readFileSync(path.join(TEMPLATES_DIR, "brands.json"), "utf-8");
  return JSON.parse(raw) as BrandDef[];
}

/**
 * 使用描述模板生成描述文本，替换 {{title}} 为品牌标题
 */
function renderDesc(template: string, brand: BrandDef): string {
  return template.replaceAll("{{title}}", brand.title);
}

/**
 * 获取某个分类下缺失的品牌列表
 */
function getMissingBrands(
  category: CategoryEntry,
  allBrands: BrandDef[],
): BrandDef[] {
  const existingIds = new Set(category.pages.map((p) => p.id));
  return allBrands.filter((b) => !existingIds.has(b.id));
}

// ---- 主命令 ----

export async function batchAdd() {
  const allBrands = loadBrands();
  const cats = await importPagesFile();

  if (cats.length === 0) {
    console.log(pc.yellow("⚠️  没有可用的分类，请先新增分类。"));
    return;
  }

  // Step 1: 选择分类
  const category = await select<CategoryEntry | typeof EXIT>({
    message: "选择目标分类:",
    options: [
      ...cats.map((c) => ({ value: c, label: `${c.title} (${c.id})` })),
      { value: EXIT, label: "← 返回首页" },
    ],
  });
  if (isCancel(category) || category === EXIT) return;

  // Step 2: 检查缺失的品牌
  const missing = getMissingBrands(category as CategoryEntry, allBrands);

  if (missing.length === 0) {
    note(
      pc.green("✅ 该分类下所有常见品牌已全部存在，无需添加！"),
      "一键添加常见品牌",
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return;
  }

  // 显示已存在的品牌数量
  const existingCount = allBrands.length - missing.length;
  console.log(
    pc.dim(`  已存在 ${existingCount} 个品牌，缺失 ${missing.length} 个品牌`),
  );

  // Step 3: 多选缺失品牌（默认全选）
  const selected = await multiselect<string>({
    message: `选择要添加的品牌（空格选中/取消，回车确认）:`,
    options: missing.map((b) => ({
      value: b.id,
      label: b.title,
      hint: b.id,
    })),
    required: false,
    initialValues: missing.map((b) => b.id),
  });
  if (isCancel(selected)) return;

  if (selected.length === 0) {
    console.log(pc.yellow("未选择任何品牌，已取消。"));
    return;
  }

  // Step 4: 输入描述模板（支持 {{title}}）
  const brandsToAdd = missing.filter((b) => selected.includes(b.id));

  const descTemplate = await text({
    message: `输入描述模板（使用 ${pc.cyan("{{title}}")} 代表品牌名，输入 .. 返回）:`,
    placeholder: `如：在{{title}}系统中添加小组件`,
    initialValue: "",
    validate: (v) => {
      if (v === "..") return undefined;
      if (!v) return "描述不能为空";
    },
  });
  if (isCancel(descTemplate) || descTemplate === "..") return;

  // 预览一个示例
  const exampleBrand = brandsToAdd[0];
  console.log(
    pc.dim(
      `  示例: ${exampleBrand.title} → "${renderDesc(descTemplate, exampleBrand)}"`,
    ),
  );

  // Step 5: 询问是否启用
  const enableResult = await select<boolean | typeof BACK>({
    message: "是否启用这些页面?",
    options: [
      { value: true, label: "启用" },
      { value: false, label: "禁用（占位页面）" },
      { value: BACK, label: "← 返回" },
    ],
  });
  if (isCancel(enableResult)) return;
  if (enableResult === BACK) return;
  const enabled = enableResult as boolean;

  // Step 6: 确认
  const brandList = brandsToAdd
    .map((b) => `  • ${b.title} (${b.id})`)
    .join("\n");

  const ok = await confirm({
    message: `确认添加以下 ${brandsToAdd.length} 个品牌到「${(category as CategoryEntry).title}」（${enabled ? "启用" : "禁用"}）?\n${brandList}`,
  });
  if (!ok || isCancel(ok)) {
    console.log(pc.yellow("已取消。"));
    return;
  }

  // Step 7: 批量创建
  const s = spinner();
  s.start(`正在批量添加 ${brandsToAdd.length} 个品牌…`);

  const cat = category as CategoryEntry;
  let created = 0;
  let skipped = 0;

  for (const brand of brandsToAdd) {
    const dir = path.join(ROUTES_DIR, cat.id, brand.id);

    if (fs.existsSync(dir)) {
      console.log(pc.yellow(`  ⚠️  目录 ${cat.id}/${brand.id} 已存在，跳过`));
      skipped++;
      continue;
    }

    fs.mkdirSync(dir, { recursive: true });

    // meta.ts
    const description = renderDesc(descTemplate, brand);
    const now = new Date();
    const updatedAt = `${now.getFullYear()}年${now.getMonth() + 1}月`;
    let metaContent = applyTemplate("page-meta.template", {
      title: brand.title,
      description,
      updatedAt,
    });
    // 品牌页面需要注入 image 字段
    if (brand.image) {
      metaContent = metaContent.replace(
        `description: "${description}"`,
        `description: "${description}",
  image: "${brand.image}"`,
      );
    }
    fs.writeFileSync(path.join(dir, "meta.ts"), metaContent, "utf-8");

    // page.tsx
    const pageContent = applyTemplate("page.template", {
      categoryId: cat.id,
      pageId: brand.id,
      componentName: toPascalCase(brand.id),
    });
    fs.writeFileSync(path.join(dir, "page.tsx"), pageContent, "utf-8");

    created++;
  }

  // Step 8: 更新 pages.ts
  if (created > 0) {
    const freshCats = await importPagesFile();
    const targetCat = freshCats.find((c) => c.id === cat.id);
    if (targetCat) {
      for (const brand of brandsToAdd) {
        if (!targetCat.pages.some((p) => p.id === brand.id)) {
          targetCat.pages.push({ id: brand.id, enabled });
        }
      }
      writePages(freshCats);
    }
  }

  s.stop(
    `完成: 创建 ${pc.green(created.toString())} 个品牌` +
      (skipped > 0 ? `, 跳过 ${pc.yellow(skipped.toString())} 个` : ""),
  );

  if (created > 0) {
    runGenerate();
  }
}
