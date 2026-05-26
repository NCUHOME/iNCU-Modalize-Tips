export interface PageDefinition {
  id: string;
  enabled: boolean;
}

export interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  order: number;
  pages: readonly PageDefinition[];
}

export const categories = [
  {
    id: "add-widget-guide",
    title: "如何添加小组件",
    description: "了解如何将小组件添加到主屏幕",
    order: 1,
    pages: [
      { id: "ios", enabled: true },
      { id: "hyperos", enabled: true },
      { id: "harmonyos", enabled: true },
      { id: "originos", enabled: true },
      { id: "coloros", enabled: true },
      { id: "magicos", enabled: true },
      { id: "flyme", enabled: false },
      { id: "android", enabled: true },
    ] as const,
  },
  {
    id: "widget-troubleshoot",
    title: "小组件刷新问题",
    description: "解决因系统后台限制导致的小组件不刷新问题",
    order: 2,
    pages: [
      { id: "hyperos", enabled: true },
      { id: "originos", enabled: false },
      { id: "harmonyos", enabled: false },
      { id: "coloros", enabled: false },
      { id: "magicos", enabled: false },
      { id: "flyme", enabled: false },
      { id: "android", enabled: true },
    ] as const,
  },
] as const;
