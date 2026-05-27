import fs from "fs";
import path from "path";
import sizeOf from "image-size";

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
const APP_DIR = path.join(PROJECT_ROOT, "app");
const OUTPUT_FILE = path.join(APP_DIR, "generated", "images-meta.ts");

export function generateImagesMeta() {
  function getAllImages(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let results: string[] = [];
    for (const entry of entries) {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(getAllImages(res));
      } else if (/\.(webp|png|jpe?g)$/i.test(entry.name)) {
        results.push(res);
      }
    }
    return results;
  }

  const images = getAllImages(APP_DIR);
  const imports: string[] = [];
  const entries: string[] = [];
  let index = 0;

  for (const img of images) {
    try {
      const buffer = fs.readFileSync(img);
      const dimensions = sizeOf(buffer);
      if (!dimensions.width || !dimensions.height) continue;

      const relativePath = path.relative(APP_DIR, img).replace(/\\/g, "/");
      const varName = `img${index++}`;
      imports.push(`import ${varName} from "../${relativePath}";`);
      entries.push(
        `  [${varName}]: { width: ${dimensions.width}, height: ${dimensions.height} },`,
      );
    } catch (e) {
      console.warn("Failed to get size for", img, e);
    }
  }

  const output = `// Auto-generated. Do not edit manually.
${imports.join("\n")}

export const imageMeta: Record<string, { width: number, height: number }> = {
${entries.join("\n")}
};
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
  console.log(`✅ Generated image map for ${images.length} images`);
}

if (
  import.meta.url.startsWith("file:") &&
  process.argv[1] === new URL(import.meta.url).pathname
) {
  generateImagesMeta();
}
