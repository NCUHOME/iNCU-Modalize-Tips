import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "示例" },
    { name: "description", content: "示例描述" },
  ];
}

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">

    </main>
  );
}