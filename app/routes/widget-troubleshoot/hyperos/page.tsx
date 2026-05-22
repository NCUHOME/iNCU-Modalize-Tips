import { routeManifest } from '~/generated/pages';
import type { Route } from './+types/page';
import { DetailHeader } from '~/components/DetailHeader';

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === 'widget-troubleshoot')
    ?.pages.find((p) => p.id === 'hyperos');
  return [{ title: page?.title }, { name: 'description', content: page?.description }];
}

export default function HyperosTroubleshoot() {
  const page = routeManifest.categories
    .find((c) => c.id === 'widget-troubleshoot')
    ?.pages.find((p) => p.id === 'hyperos');

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <DetailHeader title={page?.title ?? 'HyperOS小组件刷新问题'} image={page?.image} />
        <div className="mt-6 space-y-4">
          <section>
            <h2>检查步骤</h2>
            <ol>
              <li>
                <strong>允许后台运行</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">
                  设置 → 应用设置 → 南大家园 → 省电策略 → 选择"无限制"
                </p>
              </li>
              <li>
                <strong>重新添加小组件</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">移除小组件后重新添加</p>
              </li>
              <li>
                <strong>关闭省电模式</strong>
                <p className="text-xs text-(--text-tertiary) mt-0.5">设置 → 省电与电池 → 关闭省电模式</p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </article>
  );
}
