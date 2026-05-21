import { routeManifest } from '~/generated/pages';
import type { Route } from './+types/page';

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories
    .find((c) => c.id === 'add-widget-guide')
    ?.pages.find((p) => p.id === 'android');
  return [{ title: page?.title ?? '其他 Android' }, { name: 'description', content: page?.description ?? '' }];
}

export default function AndroidGuide() {
  const page = routeManifest.categories
    .find((c) => c.id === 'add-widget-guide')
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
            <h2>添加小组件</h2>
            <ol>
              <li>长按主屏幕空白区域，进入编辑模式</li>
              <li>轻点 <strong>小组件</strong>（或微件）</li>
              <li>在小组件列表中找到 <strong>南大家园</strong></li>
              <li>如果未找到，请检查是否有“更多”/“其他”/“安卓小部件”等按钮</li>
              <li>长按小组件并将其拖移到主屏幕上的合适位置</li>
            </ol>
          </section>
          <section>
            <h2>注意事项</h2>
            <ul>
              <li>不同品牌Android系统界面可能略有差异，请以实际为准</li>
              <li>如果以上方法无效，请查看对应品牌的指南</li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
