import { Link } from "react-router";
import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";

export function meta({}: Route.MetaArgs) {
  const category = routeManifest.categories.find(
    (c) => c.id === "add-widget-guide",
  );
  return [
    { title: category?.title ?? "如何添加小组件引导" },
    {
      name: "description",
      content: category?.description ?? "",
    },
  ];
}

export default function AddWidgetGuideIndex() {
  const category = routeManifest.categories.find(
    (c) => c.id === "add-widget-guide",
  );
  if (!category) return null;

  const enabledPages = category.pages.filter((p) => p.enabled);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">{category.title}</h1>
      <p className="text-neutral-500 text-sm mb-5">{category.description}</p>
      <div className="flex flex-col gap-3">
        {enabledPages.map((page) => (
          <Link
            key={page.id}
            to={page.id}
            className="block p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 transition-colors"
          >
            <h2 className="font-medium">{page.title}</h2>
            <p className="text-sm text-neutral-500 mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
