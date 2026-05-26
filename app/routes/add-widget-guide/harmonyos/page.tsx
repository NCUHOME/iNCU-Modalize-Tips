import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import { Image } from "~/components/Image";
import xiaoGongJu from "./image/xiao-gong-ju.webp";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "harmonyos");
}

export default function HarmonyosGuide() {
  const page = getPageData("add-widget-guide", "harmonyos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>操作步骤</h2>
        <ol>
          <li>在主屏幕双指捏合进入编辑模式</li>
          <li>
            轻点底部 <strong>服务卡片</strong>
          </li>
          <li>滑到底部</li>
          <li>
            轻点 <strong>窗口小工具</strong>
            <br />
            <Image
              src={xiaoGongJu}
              alt="窗口小工具按钮"
              caption="窗口小工具按钮"
              maxWidth={300}
            />
          </li>
          <li>
            在列表中翻到 <strong>南大家园</strong>
          </li>
          <li>轻点（或拖移）添加到主屏幕</li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>HarmonyOS 不同版本操作步骤可能略有差异</li>
        </ul>
      </section>
    </Detail>
  );
}
