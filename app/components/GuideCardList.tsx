import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";
import { GuideCard } from "~/components/GuideCard";

interface GuideCardListProps {
  pages: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    pageId: string;
    image?: string;
    stagger: number;
  }>;
  loadingDelay?: number;
}

export function GuideCardList({ pages, loadingDelay = 500 }: GuideCardListProps) {
  const navigation = useNavigation();
  const [loadingPageId, setLoadingPageId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigating = navigation.state !== "idle";

  const handleCardClick = useCallback(
    (pageId: string) => {
      setLoadingPageId(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setLoadingPageId(pageId);
      }, loadingDelay);
    },
    [loadingDelay],
  );

  useEffect(() => {
    if (!isNavigating) {
      setLoadingPageId(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isNavigating]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {pages.map((page) => (
        <GuideCard
          key={page.id}
          title={page.title}
          description={page.description}
          href={page.href}
          pageId={page.pageId}
          image={page.image}
          stagger={page.stagger}
          isLoading={loadingPageId === page.pageId}
          onClick={() => handleCardClick(page.pageId)}
        />
      ))}
    </div>
  );
}
