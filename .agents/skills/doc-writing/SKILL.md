---
name: doc-writing
description: "编写 iNCU-Modalize-Tips 项目路由文档页面的指南。当需要新增品牌页面、编写操作步骤、添加故障排查指南，或创建 add-widget-guide 或 widget-troubleshoot 分类下的 page.tsx 时使用。"
---

# 路由文档写作规范

本 skill 只管 `page.tsx` 的 **内容怎么写**。创建页面骨架时，查阅 [`docs/CLI.md`](../../../docs/CLI.md) 获取 `pnpm cli` 命令，先用 CLI 建骨架再按本文规范填充内容。

> **权威参考：** `app/routes/add-widget-guide/ios/page.tsx` — 多段落、插图、版本提示、`<Gallery>` 全覆盖。

---

## guide vs troubleshoot

|             | add-widget-guide                 | widget-troubleshoot                           |
| ----------- | -------------------------------- | --------------------------------------------- |
| 首段 `<h2>` | `操作步骤` 或 `添加主屏幕小组件` | `检查步骤`                                    |
| 步骤格式    | 纯文字 `<li>`                    | `<strong>小标题</strong>` + `<p>路径描述</p>` |
| 路径风格    | 在哪里找 → 怎么点 → 怎么拖       | 设置 → 应用 → 电池 → 权限开关                 |

---

## 文本规范

| 元素         | 写法                                               |
| ------------ | -------------------------------------------------- |
| App 名称     | `<strong>南大家园</strong>`                        |
| UI 按钮/标签 | `<strong>小组件</strong>`、`<strong>编辑</strong>` |
| 系统功能名   | `<strong>应用速冻</strong>`                        |
| 导航路径     | `设置 → 应用 → 电池`（`→` 前后各一个空格）         |
| 选项值       | 中文双引号：`选择"无限制"`                         |
| 插图前换行   | `<br />` 放在图片上方                              |

---

## `<Image>` / `<Gallery>`

```tsx
// 单图 — 放在步骤文字之后，<br /> 隔开
<Image src={img} alt="描述" caption="图注" maxWidth={300} />

// 对比图 — maxWidth=200 并排
<Gallery>
  <Image src={a} alt="浅色" caption="浅色" maxWidth={200} />
  <Image src={b} alt="深色" caption="深色" maxWidth={200} />
</Gallery>
```

- 图片统一 `.webp`，放在 `./image/` 目录下
- `alt` 必填，`caption` 可选，`maxWidth` 默认 400

---

## 嵌套子步骤

重要且难理解的步骤必须使用`<ol>`分点方便随时插入图片，不准写为嵌套子步骤；易于理解的繁多步骤（如设置页的路径）可以写作嵌套子步骤

`<ol>` 内嵌 `<ul>` 展开不同版本路径时，**必须加** `className="list-outside list-disc"`，否则圆点消失：

```tsx
<li>
  <strong>允许自启动</strong>
  <ul className="list-outside list-disc">
    <li>ColorOS 12及以上：设置 → 应用 → 自启动 → ...</li>
    <li>ColorOS 7 - 11.3：手机管家 → 权限隐私 → ...</li>
  </ul>
</li>
```

---

## section 内提示

放在 `<h2>` 正下方，固定样式：

```tsx
<p className="-mt-2 mb-1 text-neutral-600" style={{ fontSize: "12px" }}>
  <strong>iOS 16</strong>及以上版本支持在锁屏界面添加小组件。
</p>
```

也可放在 section 末尾充当全局提示。

---

## 结尾：注意事项

**有注意事项的页面必须以「注意事项」`<section>` 结尾：**

```tsx
<section>
  <h2>注意事项</h2>
  <ul>
    <li>不同品牌Android系统界面可能略有差异，请以实际为准</li>
    <li>如果以上方法无效，请查看对应品牌的指南</li>
  </ul>
</section>
```

- 通用品牌（android）：提示品牌差异 + 引导查看具体指南
- 具体品牌：提示该系统版本差异
- iOS：提示最低版本 + App 更新

---

## 占位页面

cli 会自动生成占位页面

---

## 输出前必验

- [ ] 每个 `<section>` 有且仅有一个 `<h2>`
- [ ] 步骤用 `<ol>`，注意事项用 `<ul>`
- [ ] `<strong>` 包裹 App 名、UI 按钮、系统功能名
- [ ] 路径用 `→`（前后空格），选项值用中文双引号
- [ ] 嵌套 `<ul>` 有 `className="list-outside list-disc"`
- [ ] 图片 `.webp`，用 `<br />` 隔开
- [ ] 最后一个 `<section>` 是「注意事项」
- [ ] 版本提示用固定 `className` + `fontSize`
