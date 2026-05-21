import { Link } from "react-router";
import type { Route } from "./+types/home";
import { routeManifest } from "~/generated/pages";
import { GuideCard } from "~/components/GuideCard";

export function meta({}: Route.MetaArgs) {
  const total = routeManifest.categories.reduce(
    (sum, c) => sum + c.pages.filter((p) => p.enabled).length,
    0,
  );
  return [
    { title: "使用指南" },
    {
      name: "description",
      content: `${routeManifest.categories.length} 个分类，${total} 个指南`,
    },
  ];
}

export default function Home() {
  return (
    <div className="p-5" style={{ maxWidth: 640, margin: "0 auto" }}>
      <header className="mb-7 anim-fade-up">
        <h1 className="text-[22px] font-semibold tracking-tight text-(--text)">
          使用指南
        </h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          {routeManifest.categories.length} 个分类，帮助你快速上手
        </p>
      </header>

      <div className="flex flex-col gap-7">
        {routeManifest.categories.map((category, ci) => {
          const enabledPages = category.pages.filter((p) => p.enabled);
          if (enabledPages.length === 0) return null;

          return (
            <section key={category.id} className="anim-fade-up">
              <Link
                to={`/${category.id}/`}
                className="section-link mb-3"
              >
                <h2 className="text-base font-medium text-(--text)">
                  {category.title}
                </h2>
                <p className="text-sm text-(--text-secondary) mt-0.5">
                  {category.description}
                </p>
              </Link>
              <div className="flex flex-col gap-3">
                {enabledPages.map((page, pi) => (
                  <GuideCard
                    key={page.id}
                    title={page.title}
                    description={page.description}
                    href={page.path}
                    pageId={page.id}
                    image={page.image ?? undefined}
                    stagger={pi + 1 + ci * 2}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
