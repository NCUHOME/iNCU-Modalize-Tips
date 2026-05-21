import { Outlet, useMatches, useNavigate } from "react-router";

export default function WidgetTroubleshootLayout() {
  const navigate = useNavigate();
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const isIndex = lastMatch.id.endsWith("/index");

  return (
    <div className="min-h-screen p-5" style={{ maxWidth: 640, margin: "0 auto" }}>
      {!isIndex && (
        <button
          onClick={() => navigate(-1)}
          className="back-link anim-slide-left mb-5"
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
        </button>
      )}
      <Outlet />
    </div>
  );
}
