import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === "widget-troubleshoot")
    ?.pages.find((p) => p.id === "hyperos");
  return [
    { title: page?.title ?? "HyperOS 排障" },
    { name: "description", content: page?.description ?? "" },
  ];
}

export default function HyperosTroubleshoot() {
  const page = routeManifest.categories
    .find((c) => c.id === "widget-troubleshoot")
    ?.pages.find((p) => p.id === "hyperos");

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <div className="detail-header">
          {page?.image && (
            <img src={page.image} alt="" className="brand-icon-lg" />
          )}
          <div className="detail-header-text">
            <h1>{page?.title ?? "HyperOS 小组件不刷新排障"}</h1>
            <p className="meta-date">最后更新：2026 年 5 月</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <section>
            <h2>检查步骤</h2>
            <ol>
              <li>
                <strong>关闭省电模式</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">
                  设置 → 省电与电池 → 关闭省电模式
                </p>
              </li>
              <li>
                <strong>允许后台运行</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">
                  设置 → 应用设置 → 本应用 → 省电策略 → 选择"无限制"
                </p>
              </li>
              <li>
                <strong>锁定应用</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">
                  在多任务界面将本应用下拉锁定
                </p>
              </li>
              <li>
                <strong>重启小组件</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">
                  移除小组件后重新添加
                </p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
