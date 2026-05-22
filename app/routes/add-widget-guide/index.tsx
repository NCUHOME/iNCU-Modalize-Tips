import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";
import { CategoryList } from "~/components/CategoryList";

export function meta({}: Route.MetaArgs) {
  const category = routeManifest.categories.find(
    (c) => c.id === "add-widget-guide",
  );
  return [
    { title: category?.title },
    { name: "description", content: category?.description },
  ];
}

export default function AddWidgetGuideIndex() {
  return <CategoryList categoryId="add-widget-guide" />;
}