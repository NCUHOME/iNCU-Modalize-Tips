import { routeManifest } from '~/generated/pages';
import type { Route } from './+types/page';

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === 'widget-troubleshoot')
    ?.pages.find((p) => p.id === 'android');
  return [{ title: page?.title ?? '其他 Android' }, { name: 'description', content: page?.description ?? '' }];
}

export default function AndroidTroubleshoot() {
  const page = routeManifest.categories
    .find((c) => c.id === 'widget-troubleshoot')
    ?.pages.find((p) => p.id === 'android');

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <div className="detail-header">
          {page?.image && <img src={page.image} alt="" className="brand-icon-lg" />}
          <div className="detail-header-text">
            <h1>{page?.title ?? '其他 Android'}</h1>
            <p className="meta-date">最后更新：2026年5月</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
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
        </div>
      </div>
    </article>
  );
}
