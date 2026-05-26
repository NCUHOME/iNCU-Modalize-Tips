import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import noLimit from "./image/no-limit.webp";
import { Image } from "~/components/Image";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("widget-troubleshoot", "hyperos");
}

export default function HyperosTroubleshoot() {
  const page = getPageData("widget-troubleshoot", "hyperos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>检查步骤</h2>
        <ol>
          <li>
            <strong>允许后台运行</strong>
            <p>
              设置 → 应用设置 → 找到 <strong>南大家园</strong> → 省电策略 →
              选择"无限制"
            </p>
            <Image src={noLimit} alt="无限制" caption="无限制" maxWidth={400} />
          </li>
          <li>
            <strong>重新添加小组件</strong>
            <p>移除小组件后重新添加</p>
          </li>
          <li>
            <strong>关闭省电模式</strong>
            <p>设置 → 省电与电池 → 关闭省电模式</p>
          </li>
        </ol>
      </section>
    </Detail>
  );
}
