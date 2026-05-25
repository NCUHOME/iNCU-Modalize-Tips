import type { ReactNode } from 'react';
import { DetailHeader } from '~/components/DetailHeader';

interface DetailProps {
  categoryTitle: string;
  page: {
    title?: string;
    description?: string;
    image?: string | null;
  };
  children: ReactNode;
}

export function Detail({ categoryTitle, page, children }: DetailProps) {
  return (
    <article>
      <div className="detail-article anim-fade-up">
        <DetailHeader
          categoryTitle={categoryTitle}
          title={page?.title ?? ''}
          description={page?.description ?? ''}
          image={page?.image}
        />
        <div className="mt-6 space-y-4">{children}</div>
        <p className="detail-footer-date">最后更新：2026年5月</p>
      </div>
    </article>
  );
}
