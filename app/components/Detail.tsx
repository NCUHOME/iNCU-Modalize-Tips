import type { ReactNode } from 'react';
import { DetailHeader } from '~/components/DetailHeader';

interface DetailProps {
  page: {
    title?: string;
    image?: string | null;
  };
  children: ReactNode;
}

export function Detail({ page, children }: DetailProps) {
  return (
    <article>
      <div className="detail-article anim-fade-up">
        <DetailHeader title={page?.title ?? ''} image={page?.image} />
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </article>
  );
}
