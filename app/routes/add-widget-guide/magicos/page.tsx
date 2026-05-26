import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import { Image } from "~/components/Image";
import jingDianXiaoGongJu from "./image/jing-dian-xiao-gong-ju.webp";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "magicos");
}

export default function MagicosGuide() {
  const page = getPageData("add-widget-guide", "magicos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>操作步骤</h2>
        <ol>
          <li>按住主屏幕空白区域直到进入编辑模式</li>
          <li>
            轻点底部 <strong>桌面卡片</strong>
          </li>
          <li>滑到最底下</li>
          <li>
            轻点 <strong>经典小工具</strong>
            <br />
            <Image
              src={jingDianXiaoGongJu}
              alt="经典小工具"
              caption="经典小工具"
              maxWidth={300}
            />
          </li>
          <li>
            找到 <strong>南大家园</strong>
          </li>
          <li>轻点以添加</li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>MagicOS 不同版本操作步骤可能略有差异</li>
        </ul>
      </section>
    </Detail>
  );
}
