import { Link } from "react-router";
import type { Route } from "./+types/home";
import { routeManifest } from "~/generated/pages";

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
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-6">使用指南</h1>
      <div className="flex flex-col gap-8">
        {routeManifest.categories.map((category) => {
          const enabledPages = category.pages.filter((p) => p.enabled);
          if (enabledPages.length === 0) return null;

          return (
            <section key={category.id}>
              <Link
                to={`/${category.id}/`}
                className="block mb-3"
              >
                <h2 className="text-lg font-medium text-neutral-900">
                  {category.title}
                </h2>
                <p className="text-sm text-neutral-500">
                  {category.description}
                </p>
              </Link>
              <div className="flex flex-col gap-2 ml-2">
                {enabledPages.map((page) => (
                  <Link
                    key={page.id}
                    to={page.path}
                    className="block p-3 rounded-lg border border-neutral-100 hover:border-neutral-300 transition-colors"
                  >
                    <span className="font-medium text-sm">{page.title}</span>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {page.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
