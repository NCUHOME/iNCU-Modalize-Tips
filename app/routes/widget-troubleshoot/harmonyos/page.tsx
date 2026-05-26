import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import allowBackground from "./image/allow-background.webp";
import { Image } from "~/components/Image";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("widget-troubleshoot", "harmonyos");
}

export default function HarmonyosTroubleshoot() {
  const page = getPageData("widget-troubleshoot", "harmonyos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>检查步骤</h2>
        <ol>
          <li>
            <strong>后台应用锁定</strong>
            <p>
              打开 <strong>南大家园</strong> → 进入多任务界面 → 下拉应用卡片加锁
            </p>
          </li>
          <li>
            <strong>允许应用后台运行</strong>
            <p>
              设置 → 应用启动管理 → 找到 <strong>南大家园</strong> →
              关闭自动管理 → 打开 <strong>允许后台活动</strong>
            </p>
            <Image
              src={allowBackground}
              alt="允许后台活动"
              caption="打开“允许后台活动”"
              maxWidth={400}
            />
          </li>
          <li>
            <strong>避免电池优化清理</strong>
            <p>
              设置 → 电池优化 → 轻点"不允许" → 选择"所有应用" → 找到并点击{" "}
              <strong>南大家园</strong> → 设置为不允许
            </p>
          </li>
          <li>
            <strong>关闭省电模式</strong>
            <p>设置 → 电池 → 关闭省电模式</p>
          </li>
        </ol>
      </section>
    </Detail>
  );
}
