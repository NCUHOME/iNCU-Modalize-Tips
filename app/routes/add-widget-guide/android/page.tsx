import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "android");
}

export default function AndroidGuide() {
  const page = getPageData("add-widget-guide", "android")!;

  return (
    <Detail page={page}>
      <section>
        <h2>添加小组件</h2>
        <ol>
          <li>按住主屏幕空白区域直到进入编辑模式</li>
          <li>
            轻点 <strong>小组件</strong>（或微件）
          </li>
          <li>
            在小组件列表中找到 <strong>南大家园</strong>
          </li>
          <li>
            如果未找到，请检查当前界面是否有“更多”、“其他”或“安卓小部件”等按钮。
            <strong>小组件可能隐藏在二级菜单中</strong>
          </li>
          <li>长按小组件并将其拖移到主屏幕上的合适位置</li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>不同品牌Android系统界面可能略有差异，请以实际为准</li>
          <li>如果以上方法无效，请查看对应品牌的指南</li>
        </ul>
      </section>
    </Detail>
  );
}
