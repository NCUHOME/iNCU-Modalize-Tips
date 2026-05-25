import type { ReactNode } from "react";

interface GalleryProps {
  children: ReactNode;
}

export function Gallery({ children }: GalleryProps) {
  return <div className="flex gap-3 overflow-x-auto">{children}</div>;
}
