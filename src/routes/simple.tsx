import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/simple")({
  component: SimplePage,
});

function SimplePage() {
  return (
    <main className="p-8">
      <section></section>
    </main>
  );
}
