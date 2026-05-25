import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigation } from "react-router";
import { routeManifest } from "~/generated/pages";
import { GuideCard } from "~/components/GuideCard";

interface CategoryListProps {
  categoryId: string;
}

/** 导航 pending 超过此 ms 数后显示加载态 */
const LOADING_DELAY = 200;

export function CategoryList({ categoryId }: CategoryListProps) {
  const category = routeManifest.categories.find((c) => c.id === categoryId);
  const navigation = useNavigation();
  const [loadingPageId, setLoadingPageId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!category) return null;

  const enabledPages = category.pages.filter((p) => p.enabled);
  const isNavigating = navigation.state !== "idle";

  const handleCardClick = useCallback((pageId: string) => {
    setLoadingPageId(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setLoadingPageId(pageId);
    }, LOADING_DELAY);
  }, []);

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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <header className="mb-6 anim-fade-up">
        <h1 className="text-[22px] font-semibold tracking-tight text-(--text)">
          {category.title}
        </h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          {category.description}
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {enabledPages.map((page, i) => (
          <GuideCard
            key={page.id}
            title={page.title}
            description={page.description}
            href={page.id}
            pageId={page.id}
            image={page.image || undefined}
            stagger={i + 1}
            isLoading={loadingPageId === page.id}
            onClick={() => handleCardClick(page.id)}
          />
        ))}
      </div>
    </div>
  );
}
