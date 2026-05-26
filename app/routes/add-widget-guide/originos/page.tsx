import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import { Image } from "~/components/Image";
import searchIcon from "./image/search.webp";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "originos");
}

export default function OriginosGuide() {
  const page = getPageData("add-widget-guide", "originos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>操作步骤</h2>
        <ol>
          <li>在主屏幕长按空白区域</li>
          <li>
            轻点底部 <strong>组件</strong>
          </li>
          <li>
            轻点右上角 <strong>搜索</strong> 按钮
          </li>
          <li>
            搜索 <strong>南大家园</strong>
            <br />
            <Image
              src={searchIcon}
              alt="搜索「南大家园」结果"
              caption="搜索「南大家园」结果"
              maxWidth={300}
            />
          </li>
          <li>轻点（或拖移）添加到主屏幕</li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>OriginOS 不同版本操作步骤可能略有差异</li>
        </ul>
      </section>
    </Detail>
  );
}
