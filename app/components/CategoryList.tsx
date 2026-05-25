import { routeManifest } from "~/generated/pages";
import { GuideCardList } from "~/components/GuideCardList";

interface CategoryListProps {
  categoryId: string;
}

export function CategoryList({ categoryId }: CategoryListProps) {
  const category = routeManifest.categories.find((c) => c.id === categoryId);
  if (!category) return null;

  const enabledPages = category.pages.filter((p) => p.enabled);

  const cards = enabledPages.map((page, i) => ({
    id: page.id,
    title: page.title,
    description: page.description,
    href: page.id,
    pageId: page.path,
    image: page.image || undefined,
    stagger: i + 1,
  }));

  return <GuideCardList pages={cards} />;
}
