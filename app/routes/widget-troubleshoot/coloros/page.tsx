import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("widget-troubleshoot", "coloros");
}

export default function ColorosTroubleshoot() {
  const page = getPageData("widget-troubleshoot", "coloros")!;

  return (
    <Detail page={page}>
      <section>
        <h2>检查步骤</h2>
        <ol>
          <li>
            <strong>锁定后台应用</strong>
            <p>
              进入最近任务界面 → 长按底部清除按钮 → 跳转管理界面 → 锁定{" "}
              <strong>南大家园</strong>
            </p>
          </li>
          <li>
            <strong>允许自启动</strong>
            <ul className="option-list">
              <li>
                ColorOS 12及以上：设置 → 应用 → 自启动 → 找到{" "}
                <strong>南大家园</strong> → 开启（系统最多允许 5 个应用自启动）
              </li>
              <li>
                ColorOS 7 - 11.3：手机管家 → 权限隐私 → 自启动管理 → 找到{" "}
                <strong>南大家园</strong> → 开启
              </li>
              <li>
                "允许自启动"和"允许关联启动"至少开启一个，即可避免被{" "}
                <strong>应用速冻</strong> 清理
              </li>
            </ul>
          </li>
          <li>
            <strong>关闭省电模式</strong>
            <p>设置 → 电池 → 省电模式 → 关闭</p>
          </li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>
            以上操作基于 ColorOS 7.2
            及以上版本，更早版本系统操作路径可能略有差异
          </li>
        </ul>
      </section>
    </Detail>
  );
}
