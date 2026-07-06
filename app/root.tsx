import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { mincu } from "mincu-react";

export const links: Route.LinksFunction = () => [
  // 不使用外部字体，完全依赖系统字体
];

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    document.documentElement.style.colorScheme = t;
  } catch(e) {}
})();
`;

function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

const safariScript = `
(function() {
  try {
    var ua = navigator.userAgent;
    var isSafari = /^((?!chrome|android).)*safari/i.test(ua) ||
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isSafari) {
      document.documentElement.classList.add('safari');
    }
  } catch(e) {}
})();
`;

function SafariScript() {
  return <script dangerouslySetInnerHTML={{ __html: safariScript }} />;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ThemeScript />
        <SafariScript />
        <script
          defer
          src="https://s.ncuos.com/script.js"
          data-website-id="d8f69365-d14d-4c9b-8804-b6b7482c513e"
        />
      </head>
      <body>
        <main id="main-content">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const nativeTheme = mincu?.colorScheme;
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    return nativeTheme ?? "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      if (next === nativeTheme) {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", next);
      }
    } catch {}
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="theme-btn"
        style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}
        aria-label="切换主题"
      >
        <svg
          className="theme-icon-sun"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg
          className="theme-icon-moon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
