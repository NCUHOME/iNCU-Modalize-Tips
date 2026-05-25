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
    pageId: page.id,
    image: page.image || undefined,
    stagger: i + 1,
  }));

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
      <GuideCardList pages={cards} />
    </div>
  );
}
