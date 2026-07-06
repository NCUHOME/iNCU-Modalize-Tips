import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useNavigation } from "react-router";
import { GuideCard } from "~/components/GuideCard";
import { trackEvent } from "~/lib/analytics";
import { routeManifest } from "~/generated/pages";
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

export function GuideCardList({
  pages,
  loadingDelay = 500,
}: GuideCardListProps) {
  const navigation = useNavigation();
  const loadingPageId = useSyncExternalStore(
    subscribeLoadingPageId,
    getLoadingPageId,
    getLoadingPageId,
  );
  const isNavigating = navigation.state !== "idle";

  const handleCardClick = useCallback(
    (pageId: string) => {
      const clickedPage = pages.find((p) => p.pageId === pageId);
      if (clickedPage) {
        // pageId is a path like "/add-widget-guide/ios"
        const parts = clickedPage.pageId.split("/").filter(Boolean);
        const category_id = parts[0] ?? "";
        const page_id = parts[1] ?? "";
        const cat = routeManifest.categories.find((c) => c.id === category_id);
        trackEvent("点击卡片", {
          category_id,
          category: cat?.title ?? "",
          page_id,
          page_title: clickedPage.title,
        });
      }

      setLoadingPageId(null);
      clearLoadingTimer();
      setLoadingTimer(
        setTimeout(() => {
          setLoadingPageId(pageId);
          setLoadingTimer(null);
        }, loadingDelay),
      );
    },
    [loadingDelay, pages],
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
