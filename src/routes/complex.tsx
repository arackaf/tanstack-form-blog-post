import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/complex")({
  component: ComplexPage,
});

function ComplexPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Complex Route</h1>
      <section className="mt-4 rounded-lg border border-zinc-200 p-4">
        <h2 className="font-medium">Sample Complex Content</h2>
        <p className="mt-2 text-zinc-600">
          Use this page for more advanced UI or form examples.
        </p>
      </section>
    </main>
  );
}
