type Listener = () => void;

let loadingPageId: string | null = null;
let timerId: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

export function getLoadingPageId(): string | null {
  return loadingPageId;
}

export function setLoadingPageId(id: string | null): void {
  loadingPageId = id;
  for (const fn of listeners) fn();
}

export function setLoadingTimer(id: ReturnType<typeof setTimeout> | null): void {
  timerId = id;
}

export function clearLoadingTimer(): void {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

export function subscribeLoadingPageId(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
