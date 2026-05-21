import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === "add-widget-guide")
    ?.pages.find((p) => p.id === "hyperos");
  return [
    { title: page?.title ?? "HyperOS 添加小组件" },
    { name: "description", content: page?.description ?? "" },
  ];
}

export default function HyperosGuide() {
  const page = routeManifest.categories
    .find((c) => c.id === "add-widget-guide")
    ?.pages.find((p) => p.id === "hyperos");

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <div className="detail-header">
          {page?.image && (
            <img src={page.image} alt="" className="brand-icon-lg" />
          )}
          <div className="detail-header-text">
            <h1>{page?.title ?? "HyperOS 添加小组件"}</h1>
            <p className="meta-date">最后更新：2026 年 5 月</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <section>
            <h2>操作步骤</h2>
            <ol>
              <li>在主屏幕双指捏合或长按空白区域</li>
              <li>点击底部 <strong>添加工具</strong> 或 <strong>小组件</strong></li>
              <li>在小组件列表中找到本应用</li>
              <li>选择合适的小组件样式和尺寸</li>
              <li>点击 <strong>添加到主屏幕</strong></li>
            </ol>
          </section>
          <section>
            <h2>注意事项</h2>
            <ul>
              <li>HyperOS 基于 Android，不同机型操作可能略有差异</li>
              <li>部分 MIUI 版本操作路径可能不同</li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
