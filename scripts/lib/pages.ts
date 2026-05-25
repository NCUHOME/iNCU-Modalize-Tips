import fs from "node:fs";
import path from "node:path";
import type { PageEntry, CategoryEntry } from "./types";
import { PAGES_FILE, ROUTES_DIR } from "./constants";

export function parsePagesFile(content: string): CategoryEntry[] {
  const categories: CategoryEntry[] = [];
  const categoryRegex =
    /\{\s*\n\s+id:\s*'([^']+)',\s*\n\s+title:\s*'([^']*)',\s*\n\s+description:\s*'([^']*)',\s*\n\s+order:\s*(\d+),\s*\n\s+pages:\s*\[([\s\S]*?)\]\s*as\s+const,\s*\n\s*\},/g;
  let match: RegExpExecArray | null;
  while ((match = categoryRegex.exec(content)) !== null) {
    const pages: PageEntry[] = [];
    const pageRegex = /\{\s*id:\s*'([^']+)',\s*enabled:\s*(true|false)\s*\},?/g;
    let pm: RegExpExecArray | null;
    while ((pm = pageRegex.exec(match[5])) !== null) {
      pages.push({ id: pm[1], enabled: pm[2] === "true" });
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

/** Serialize categories back to pages.ts format */
export function rebuildPagesFile(cats: CategoryEntry[]): string {
  const lines: string[] = [];
  lines.push(`export interface PageDefinition {`);
  lines.push(`  id: string;`);
  lines.push(`  enabled: boolean;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface CategoryConfig {`);
  lines.push(`  id: string;`);
  lines.push(`  title: string;`);
  lines.push(`  description: string;`);
  lines.push(`  order: number;`);
  lines.push(`  pages: readonly PageDefinition[];`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const categories = [`);
  for (let ci = 0; ci < cats.length; ci++) {
    const c = cats[ci];
    lines.push(`  {`);
    lines.push(`    id: '${c.id}',`);
    lines.push(`    title: '${c.title}',`);
    lines.push(`    description: '${c.description}',`);
    lines.push(`    order: ${c.order},`);
    lines.push(`    pages: [`);
    for (let pi = 0; pi < c.pages.length; pi++) {
      const p = c.pages[pi];
      lines.push(`      { id: '${p.id}', enabled: ${p.enabled} },`);
    }
    lines.push(`    ] as const,`);
    lines.push(`  },`);
  }
  lines.push(`] as const;`);
  lines.push(``);
  return lines.join("\n");
}

/** Read a meta.ts file and return { title, desc, image } */
export function readMeta(
  categoryId: string,
  pageId: string,
): { title: string; desc: string; image: string } {
  const fp = path.join(ROUTES_DIR, categoryId, pageId, "meta.ts");
  if (!fs.existsSync(fp)) return { title: pageId, desc: "", image: "" };
  const c = fs.readFileSync(fp, "utf-8");
  const tm = c.match(/title:\s*"([^"]*)"/);
  const dm = c.match(/description:\s*"([^"]*)"/);
  const im = c.match(/image:\s*"([^"]*)"/);
  return {
    title: tm?.[1] ?? pageId,
    desc: dm?.[1] ?? "",
    image: im?.[1] ?? "",
  };
}

/** Write a meta.ts file */
export function writeMeta(
  categoryId: string,
  pageId: string,
  title: string,
  description: string,
  image?: string,
): void {
  const dir = path.join(ROUTES_DIR, categoryId, pageId);
  fs.mkdirSync(dir, { recursive: true });
  const imgLine = image
    ? `,
  image: "${image}"`
    : "";
  fs.writeFileSync(
    path.join(dir, "meta.ts"),
    `export const routeMeta = {
  title: "${title}",
  description: "${description}"${imgLine},
} as const;
`,
    "utf-8",
  );
}

/** Read pages.ts from disk and parse */
export function readPages(): CategoryEntry[] {
  return parsePagesFile(fs.readFileSync(PAGES_FILE, "utf-8"));
}

/** Write categories back to pages.ts */
export function writePages(cats: CategoryEntry[]): void {
  fs.writeFileSync(PAGES_FILE, rebuildPagesFile(cats), "utf-8");
}
