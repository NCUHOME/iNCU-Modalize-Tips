import { Outlet, useMatches, Link } from "react-router";

export default function AddWidgetGuideLayout() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const isIndex = lastMatch.id.endsWith("/index");

  return (
    <div className="min-h-screen p-5">
      {!isIndex && (
        <Link
          to="/add-widget-guide/"
          className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回
        </Link>
      )}
      <Outlet />
    </div>
  );
}
