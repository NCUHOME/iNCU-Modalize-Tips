import { useLocation } from "react-router";
import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/page";
import { DetailHeader } from "~/components/DetailHeader";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === 'add-widget-guide')
    ?.pages.find((p) => p.id === 'coloros');
  return [{ title: page?.title }, { name: 'description', content: page?.description }];
}

export default function OsPage() {
  const path = useLocation().pathname;
  const [, categoryId, pageId] = path.split("/");
  const category = routeManifest.categories.find((c) => c.id === categoryId);
  const page = category?.pages.find((p) => p.id === pageId);

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <DetailHeader title={page?.title ?? pageId} image={page?.image} />
        <div className="mt-8 text-(--text-tertiary) text-sm">
          此页面正在准备中，敬请期待。
        </div>
      </div>
    </article>
  );
}
