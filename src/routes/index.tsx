import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="p-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Hello World!</h1>
      </section>
    </main>
  );
}
