import { type RouteConfig, route, index } from "@react-router/dev/routes";
import { routeManifest } from "./generated/pages";

const routes: RouteConfig = [index("routes/home.tsx")];

for (const category of routeManifest.categories) {
  const children: RouteConfig = [
    index(`routes/${category.id}/index.tsx`),
  ];

  for (const page of category.pages) {
    if (page.enabled) {
      children.push(
        route(page.id, `routes/${category.id}/${page.id}/page.tsx`),
      );
    } else {
      // Disabled pages redirect to parent via shared redirect component
      children.push({
        path: page.id,
        id: `redirect-${category.id}-${page.id}`,
        file: "routes/redirect-page.tsx",
      });
    }
  }

  routes.push(
    route(category.id, `routes/${category.id}/layout.tsx`, children),
  );
}

export default routes satisfies RouteConfig;
