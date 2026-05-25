import { getCategoryData, getPageData, getPageMeta } from '~/lib/page';
import type { Route } from './+types/page';
import { Detail } from '~/components/Detail';

export function meta({}: Route.MetaArgs) {
  return getPageMeta('widget-troubleshoot', 'android');
}

export default function AndroidTroubleshoot() {
  const category = getCategoryData('widget-troubleshoot')!;
  const page = getPageData('widget-troubleshoot', 'android')!;

  return (
    <Detail categoryTitle={category.title} page={page}>
          <section>
            <h2>检查步骤</h2>
            <ol>
              <li>
                <strong>允许后台运行</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">设置 → 应用 → 南大家园 → 电池 → 选择“无限制”（或“允许后台运行”等）</p>
              </li>
              <li>
                <strong>关闭省电模式</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">设置 → 电池 → 关闭省电模式</p>
              </li>
              <li>
                <strong>锁定后台任务</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">在多任务界面将南大家园锁定，防止被系统清理</p>
              </li>
              <li>
                <strong>重新添加小组件</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">移除小组件后重新添加</p>
              </li>
            </ol>
          </section>
          <section>
            <h2>注意事项</h2>
            <ul>
              <li>不同品牌Android设置可能略有差异，请以实际为准</li>
              <li>如果以上方法无效，请查看对应品牌的指南</li>
            </ul>
          </section>
    </Detail>
  );
}
