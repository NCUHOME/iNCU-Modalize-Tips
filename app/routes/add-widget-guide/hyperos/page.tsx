import { routeManifest } from '~/generated/pages';
import type { Route } from './+types/page';

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories.find((c) => c.id === 'add-widget-guide')?.pages.find((p) => p.id === 'hyperos');
  return [{ title: page?.title }, { name: 'description', content: page?.description }];
}

export default function HyperosGuide() {
  const page = routeManifest.categories.find((c) => c.id === 'add-widget-guide')?.pages.find((p) => p.id === 'hyperos');

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <div className="detail-header">
          {page?.image && <img src={page.image} alt="" className="brand-icon-lg" />}
          <div className="detail-header-text">
            <h1>{page?.title ?? 'HyperOS添加小组件'}</h1>
            <p className="meta-date">最后更新：2026年5月</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <section>
            <h2>操作步骤</h2>
            <ol>
              <li>在主屏幕双指捏合或长按空白区域</li>
              <li>
                点击底部 <strong>小部件</strong>
              </li>
              <li>
                轻点 <strong>全部应用</strong>
              </li>
              <li>
                点击底部 <strong>安卓小部件</strong> 查看所有小组件
              </li>
              <li>
                在小组件列表中找到 <strong>南大家园</strong>
              </li>
              <li>轻点（或拖移）添加到锁定屏幕</li>
            </ol>
          </section>
          <section>
            <h2>注意事项</h2>
            <ul>
              <li>HyperOS/MIUI不同机型操作可能略有差异</li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
