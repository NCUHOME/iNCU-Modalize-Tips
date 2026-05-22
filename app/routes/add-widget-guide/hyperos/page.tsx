import { getPageData, getPageMeta } from '~/lib/page';
import type { Route } from './+types/page';
import { Detail } from '~/components/Detail';
import { Image } from '~/components/Image';
import xiaoBuJian from './image/xiao-bu-jian.webp';

export function meta({}: Route.MetaArgs) {
  return getPageMeta('add-widget-guide', 'hyperos');
}

export default function HyperosGuide() {
  const page = getPageData('add-widget-guide', 'hyperos')!;

  return (
    <Detail page={page}>
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
            <br />
            <Image src={xiaoBuJian} alt="安卓小部件按钮" caption="安卓小部件按钮" maxWidth={300} />
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
    </Detail>
  );
}
