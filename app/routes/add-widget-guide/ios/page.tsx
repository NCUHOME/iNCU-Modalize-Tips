import { getPageData, getPageMeta } from "~/lib/page";
import type { Route } from "./+types/page";
import { Detail } from "~/components/Detail";
import { Image } from "~/components/Image";
import { Gallery } from "~/components/Gallery";
import liquidGlass from "./image/liquid_glass.webp";
import tintLight from "./image/tint.webp";
import tintDark from "./image/tint_dark.webp";

export function meta({}: Route.MetaArgs) {
  return getPageMeta("add-widget-guide", "ios");
}

export default function IosGuide() {
  const page = getPageData("add-widget-guide", "ios")!;

  return (
    <Detail page={page}>
      <section>
        <h2>操作步骤</h2>
        <ol>
          <li>
            长按主屏幕空白区域进入编辑模式，或按住主屏幕背景直到图标开始抖动
          </li>
          <li>
            轻点屏幕顶部的 <strong>编辑</strong>，然后选取{" "}
            <strong>添加小组件</strong>
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
        <p className="-mt-2 mb-1 text-neutral-500" style={{ fontSize: "12px" }}>
          <strong>iOS 16</strong>及以上版本支持在锁屏界面添加小组件。
        </p>
        <ol>
          <li>
            按住锁定屏幕，直到出现 <strong>自定义</strong> 按钮，然后轻点{" "}
            <strong>自定义</strong>
          </li>
          <li>
            轻点 <strong>添加小组件</strong>
          </li>
          <li>
            找到 <strong>南大家园</strong> 并轻点（或拖移）添加到锁定屏幕
          </li>
          <li>
            轻点 <strong>关闭</strong> 按钮，然后轻点 <strong>完成</strong>
          </li>
        </ol>
      </section>
      <section>
        <h2>自定义小组件颜色</h2>
        <p className="-mt-2 mb-1 text-neutral-500" style={{ fontSize: "12px" }}>
          <strong>iOS 18</strong>及以上版本支持自定义小组件外观。
        </p>
        <ol>
          <li>
            长按主屏幕空白区域进入编辑模式，或按住主屏幕背景直到图标开始抖动
          </li>
          <li>
            轻点屏幕顶部的 <strong>编辑</strong>，然后选取{" "}
            <strong>自定义</strong>
          </li>
          <li>除默认外还有以下选项可供调整：</li>
        </ol>
        <ul>
          <li>
            <strong>透明</strong>：使小组件变为半透明（仅{" "}
            <strong>iOS 26</strong> 及以上版本支持）
            <br />
            <Image
              src={liquidGlass}
              alt="透明效果"
              caption="透明效果"
              maxWidth={300}
            />
          </li>
          <li>
            <strong>色调</strong>
            ：为小组件添加颜色，使用滑块选取颜色及饱和度，然后选取"浅色"、"深色"或"自动"。
            <br />
            <Gallery>
              <Image
                src={tintLight}
                alt="浅色色调"
                caption="浅色模式"
                maxWidth={200}
              />
              <Image
                src={tintDark}
                alt="深色色调"
                caption="深色模式"
                maxWidth={200}
              />
            </Gallery>
          </li>
        </ul>
      </section>
      <section>
        <h2>注意事项</h2>
        <ul>
          <li>确保iOS版本不低于14.0</li>
          <li>如果找不到小组件，请确认应用已更新到最新版本</li>
        </ul>
      </section>
    </Detail>
  );
}
