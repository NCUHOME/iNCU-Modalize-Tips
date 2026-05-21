import { useLocation } from "react-router";
import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  return [{ title: "使用指南" }];
}

export default function OsPage() {
  const path = useLocation().pathname;
  const [, categoryId, pageId] = path.split("/");
  const category = routeManifest.categories.find((c) => c.id === categoryId);
  const page = category?.pages.find((p) => p.id === pageId);

  return (
    <article className="prose prose-neutral max-w-none">
      <h1>{page?.title ?? pageId}</h1>
      <p className="text-neutral-500 text-sm">{page?.description}</p>
      <div className="mt-8 text-neutral-400 text-sm">
        此页面正在准备中，敬请期待。
      </div>
    </article>
  );
}
