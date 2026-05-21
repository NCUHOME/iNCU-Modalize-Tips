import type { Route } from "./+types/index";
import { routeManifest } from "~/generated/pages";
import { GuideCard } from "~/components/GuideCard";

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
      <header className="mb-6 anim-fade-up">
        <h1 className="text-[22px] font-semibold tracking-tight text-(--text)">
          {category.title}
        </h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          {category.description}
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {enabledPages.map((page, i) => (
          <GuideCard
            key={page.id}
            title={page.title}
            description={page.description}
            href={page.id}
            pageId={page.id}
            image={page.image || undefined}
            stagger={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
