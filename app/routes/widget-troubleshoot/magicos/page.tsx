import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("widget-troubleshoot", "magicos");
}

export default function MagicOSTroubleshoot() {
  const page = getPageData("widget-troubleshoot", "magicos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>检查步骤</h2>
        <ol>
          <li>
            <strong>多任务卡片加锁</strong>
            <p>
              打开应用 → 进入多任务界面 → 按住 <strong>南大家园</strong>{" "}
              卡片下滑加锁
            </p>
          </li>
          <li>
            <strong>允许应用后台活动</strong>
            <p>
              设置 → 应用启动管理 → 找到 <strong>南大家园</strong> →
              关闭自动管理 → 勾选"允许后台活动"
            </p>
          </li>
          <li>
            <strong>忽略电池优化</strong>
            <p>
              设置 → 电池优化 → 轻点"不允许" → 选择"所有应用" → 找到{" "}
              <strong>南大家园</strong> → 设置为不允许
            </p>
          </li>
          <li>
            <strong>关闭省电模式</strong>
            <p>设置 → 电池 → 关闭低电量模式 / 省电模式 / 超级省电</p>
          </li>
          <li>
            <strong>打开智能维护</strong>
            <p>系统管家 → 右上角设置 → 扩展业务 → 打开"智能维护"</p>
          </li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>省电模式、超级省电模式仅部分机型支持，请以实际使用为准</li>
        </ul>
      </section>
    </Detail>
  );
}
