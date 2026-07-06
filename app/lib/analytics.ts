export type EventName = "点击卡片" | "点击返回";

export interface CardClickProps {
  category_id: string;
  category: string;
  page_id: string;
  page_title: string;
}

export interface BackClickProps {
  from_path: string;
}

export type EventPayloads = {
  点击卡片: CardClickProps;
  点击返回: BackClickProps;
};

declare global {
  interface Window {
    umami?: {
      track: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}

export function trackEvent<Name extends EventName>(
  name: Name,
  payload: EventPayloads[Name],
): void {
  if (typeof window === "undefined") return;

  try {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Tracking event: ${name}`, payload);
    }

    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, payload as unknown as Record<string, unknown>);
    }
  } catch (_err) {
    console.error(`[Analytics] Failed to track event: ${name}`, _err);
  }
}

export default trackEvent;
