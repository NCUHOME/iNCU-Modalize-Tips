import { redirect } from "react-router";
import type { Route } from "./+types/redirect-page";

export function clientLoader({}: Route.ClientLoaderArgs) {
  const path = window.location.pathname;
  // Extract parent path: /category/page → /category
  const parentPath = path.substring(0, path.lastIndexOf("/")) || "/";
  return redirect(parentPath);
}

export default function RedirectPage() {
  // The clientLoader redirect runs before this renders
  return null;
}
