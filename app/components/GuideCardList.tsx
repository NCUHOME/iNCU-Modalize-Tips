import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useNavigation } from "react-router";
import { GuideCard } from "~/components/GuideCard";
import {
  getLoadingPageId,
  setLoadingPageId,
  setLoadingTimer,
  clearLoadingTimer,
  subscribeLoadingPageId,
} from "~/lib/loading-store";

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
  const loadingPageId = useSyncExternalStore(
    subscribeLoadingPageId,
    getLoadingPageId,
    getLoadingPageId,
  );
  const isNavigating = navigation.state !== "idle";

  const handleCardClick = useCallback(
    (pageId: string) => {
      setLoadingPageId(null);
      clearLoadingTimer();
      setLoadingTimer(
        setTimeout(() => {
          setLoadingPageId(pageId);
          setLoadingTimer(null);
        }, loadingDelay),
      );
    },
    [loadingDelay],
  );

  useEffect(() => {
    if (!isNavigating) {
      setLoadingPageId(null);
      clearLoadingTimer();
    }
  }, [isNavigating]);

  useEffect(() => {
    return () => {
      clearLoadingTimer();
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
