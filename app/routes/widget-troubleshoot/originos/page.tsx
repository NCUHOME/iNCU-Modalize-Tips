import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("widget-troubleshoot", "originos");
}

export default function OriginosTroubleshoot() {
  const page = getPageData("widget-troubleshoot", "originos")!;

  return (
    <Detail page={page}>
      <section>
        <h2>检查步骤</h2>
        <ol>
          <li>
            <strong>允许后台高耗电</strong>
            <p>
              设置 → 电池 → 后台耗电管理 → 选择 <strong>南大家园</strong> → 开启{" "}
              <strong>允许后台高耗电</strong>
            </p>
          </li>
          <li>
            <strong>开启自启动权限</strong>
            <p>
              手机管家 → 应用管理 → 权限管理 → 权限 → 自启动 → 开启{" "}
              <strong>南大家园</strong>
            </p>
          </li>
          <li>
            <strong>添加至加速白名单</strong>
            <p>
              调出卡片式后台 → 按住 <strong>南大家园</strong> 下滑加锁
            </p>
          </li>
          <li>
            <strong>允许通知</strong>
            <p>
              设置 → 通知与状态栏 → 找到 <strong>南大家园</strong> →
              开启"允许通知"
            </p>
          </li>
        </ol>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>以上操作为 OriginOS 系统，Funtouch OS 操作路径可能略有差异</li>
        </ul>
      </section>
    </Detail>
  );
}
