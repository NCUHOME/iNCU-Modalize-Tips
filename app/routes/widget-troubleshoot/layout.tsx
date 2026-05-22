import { Outlet, useMatches } from "react-router";
import { BackButton } from "~/components/BackButton";

export default function WidgetTroubleshootLayout() {
  const matches = useMatches();
  const lastMatch = matches[matches.length - 1];
  const isIndex = lastMatch.id.endsWith("/index");

  return (
    <div className="min-h-screen p-5" style={{ maxWidth: 640, margin: "0 auto" }}>
      {!isIndex && <BackButton />}
      <div className={!isIndex ? 'has-back-btn' : ''}>
        <Outlet />
      </div>
    </div>
  );
}
