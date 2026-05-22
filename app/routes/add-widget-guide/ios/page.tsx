import { routeManifest } from '~/generated/pages';
import type { Route } from './+types/page';

export function meta({}: Route.MetaArgs) {
  const page = routeManifest.categories.find((c) => c.id === 'add-widget-guide')?.pages.find((p) => p.id === 'ios');
  return [{ title: page?.title }, { name: 'description', content: page?.description }];
}

export default function IosGuide() {
  const page = routeManifest.categories.find((c) => c.id === 'add-widget-guide')?.pages.find((p) => p.id === 'ios');

  return (
    <article>
      <div className="detail-article anim-fade-up">
        <div className="detail-header">
          {page?.image && <img src={page.image} alt="" className="brand-icon-lg" />}
          <div className="detail-header-text">
            <h1>{page?.title ?? 'iOS添加小组件'}</h1>
            <p className="meta-date">最后更新：2026年5月</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <section>
            <h2>操作步骤</h2>
            <ol>
              <li>长按主屏幕空白区域，进入编辑模式</li>
              <li>
                点击左上角的 <strong>编辑</strong> 按钮
              </li>
              <li>
                轻点 <strong>添加小组件</strong>
              </li>
              <li>
                搜索或找到 <strong>南大家园</strong>
              </li>
              <li>选择合适的小组件尺寸</li>
              <li>
                点击 <strong>添加小组件</strong>
              </li>
              <li>
                点击右上角 <strong>完成</strong> 退出编辑模式
              </li>
            </ol>
          </section>
          <section>
            <h2>添加锁屏小组件</h2>
            <p className="text-neutral-500 -mt-2 mb-1" style={{ fontSize: '12px' }}>
              <strong>iOS 16</strong>及以上版本支持在锁屏界面添加小组件。
            </p>
            <ol>
              <li>
                按住锁定屏幕，直到出现 <strong>自定义</strong> 按钮，然后轻点 <strong>自定义</strong>
              </li>
              <li>
                轻点 <strong>添加小组件</strong>
              </li>
              <li>
                找到 <strong>南大家园</strong> 并轻点（或拖移）添加到锁定屏幕
              </li>
              <li>
                轻点右上角 <strong>关闭</strong>，然后轻点 <strong>完成</strong>
              </li>
            </ol>
          </section>
          <section>
            <h2>注意事项</h2>
            <ul>
              <li>确保iOS版本不低于14.0</li>
              <li>如果找不到小组件，请确认应用已更新到最新版本</li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
