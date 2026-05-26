import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import { Image } from "~/components/Image";
import searchIcon from "./image/search.webp";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "coloros");
}

export default function ColorosGuide() {
  const page = getPageData("add-widget-guide", "coloros")!;

  return (
    <Detail page={page}>
      <section>
        <h2>操作步骤</h2>
        <ol>
          <li>按住主屏幕空白区域直到进入编辑模式</li>
          <li>
            轻点底部 <strong>卡片</strong> 按钮
          </li>
          <li>
            轻点右上角 <strong>搜索</strong> 按钮
            <br />
            <Image
              src={searchIcon}
              alt="搜索按钮"
              caption="搜索按钮"
              maxWidth={300}
            />
          </li>
          <li>
            搜索 <strong>南大家园</strong>
          </li>
          <li>轻点小组件</li>
          <li>
            轻点 <strong>添加到桌面</strong>
          </li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>ColorOS 不同版本操作步骤可能略有差异</li>
        </ul>
      </section>
    </Detail>
  );
}
