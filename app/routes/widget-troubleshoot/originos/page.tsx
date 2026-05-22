import { useLocation } from "react-router";
import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";

export function meta({}: Route.MetaArgs) {
  return getPageMeta('widget-troubleshoot', 'originos');
}

export default function OsPage() {
  const path = useLocation().pathname;
  const [, categoryId, pageId] = path.split("/");
  const page = getPageData(categoryId, pageId);

  return (
    <Detail page={page ?? {}}>
      <div className="mt-8 text-(--text-tertiary) text-sm">
        此页面正在准备中，敬请期待。
      </div>
    </Detail>
  );
}
