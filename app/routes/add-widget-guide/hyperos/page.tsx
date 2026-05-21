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
  return (
    <article className="prose prose-neutral max-w-none">
      <h1>HyperOS 添加小组件</h1>
      <p className="text-neutral-500 text-sm">最后更新：2026 年 5 月</p>
      <div className="mt-6 space-y-4 text-neutral-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-neutral-900">操作步骤</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>在主屏幕双指捏合或长按空白区域</li>
            <li>点击底部 <strong>添加工具</strong> 或 <strong>小组件</strong></li>
            <li>在小组件列表中找到本应用</li>
            <li>选择合适的小组件样式和尺寸</li>
            <li>点击 <strong>添加到主屏幕</strong></li>
          </ol>
        </section>
        <section>
          <h2 className="text-base font-medium text-neutral-900">注意事项</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>HyperOS 基于 Android，不同机型操作可能略有差异</li>
            <li>部分 MIUI 版本操作路径可能不同</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
