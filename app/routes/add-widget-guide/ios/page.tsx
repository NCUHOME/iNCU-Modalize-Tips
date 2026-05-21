import { routeManifest } from "~/generated/pages";
import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === "add-widget-guide")
    ?.pages.find((p) => p.id === "ios");
  return [
    { title: page?.title ?? "iOS 添加小组件" },
    { name: "description", content: page?.description ?? "" },
  ];
}

export default function IosGuide() {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1>iOS 添加小组件</h1>
      <p className="text-neutral-500 text-sm">最后更新：2026 年 5 月</p>
      <div className="mt-6 space-y-4 text-neutral-700 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-neutral-900">操作步骤</h2>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>长按主屏幕空白区域，进入编辑模式</li>
            <li>点击左上角的 <strong>+</strong> 按钮</li>
            <li>搜索或找到本应用的小组件</li>
            <li>选择合适的小组件尺寸</li>
            <li>点击 <strong>添加小组件</strong></li>
            <li>点击右上角 <strong>完成</strong> 退出编辑模式</li>
          </ol>
        </section>
        <section>
          <h2 className="text-base font-medium text-neutral-900">注意事项</h2>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>确保 iOS 版本不低于 14.0</li>
            <li>如果找不到小组件，请确认应用已更新到最新版本</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
