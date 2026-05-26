import type { ReactNode } from "react";
import { DetailHeader } from "~/components/DetailHeader";

interface DetailProps {
  page: {
    title?: string;
    description?: string;
    image?: string | null;
    updatedAt?: string | null;
  };
  children: ReactNode;
}

export function Detail({ page, children }: DetailProps) {
  return (
    <article>
      <div className="detail-article anim-fade-up">
        <DetailHeader
          title={page?.title ?? ""}
          description={page?.description ?? ""}
          image={page?.image}
        />
        <div className="mt-6 space-y-4">{children}</div>
        {page?.updatedAt && (
          <p className="detail-footer-date">最后更新：{page.updatedAt}</p>
        )}
      </div>
    </article>
  );
}
