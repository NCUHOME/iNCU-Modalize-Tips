import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";
import { CategoryList } from "~/components/CategoryList";

export function meta({}: Route.MetaArgs) {
  const category = routeManifest.categories.find(
    (c) => c.id === "widget-troubleshoot",
  );
  return [
    { title: category?.title },
    {
      name: "description",
      content: category?.description,
    },
  ];
}

export default function WidgetTroubleshootIndex() {
  return <CategoryList categoryId="widget-troubleshoot" />;
}
