import { useLocation } from "react-router";
import { getPageData, getPageMeta } from "~/lib/page";
// @ts-expect-error 禁用页面 — 路由类型未生成
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "flyme");
}

export default function OsPage() {
  const path = useLocation().pathname;
  const [, categoryId, pageId] = path.split("/");
  const page = getPageData(categoryId, pageId);

  return (
    <Detail page={page ?? {}}>
      <div className="placeholder-text mt-8">此页面正在准备中，敬请期待。</div>
    </Detail>
  );
}
