import type { Config } from "@react-router/dev/config";
import { routeManifest } from "./app/generated/pages";

export default {
  ssr: false,
  get prerender() {
    const paths: string[] = ["/"];
    for (const category of routeManifest.categories) {
      paths.push(`/${category.id}/`);
      for (const page of category.pages) {
        if (page.enabled) paths.push(page.path);
      }
    }
    return paths;
  },
} satisfies Config;
