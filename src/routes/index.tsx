import { createFileRoute } from "@tanstack/react-router";

import { formOptions, useForm } from "@tanstack/react-form-start";

interface User {
  firstName: string;
  lastName: string;
  hobbies: Array<string>;
}
const defaultUser: User = { firstName: "", lastName: "", hobbies: [] };

const form = useForm({
  defaultValues: defaultUser,
  onSubmit: async ({ value }) => {
    console.log(value);
  },
});

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="p-8">
      <section>
        <form onSubmit={form.handleSubmit}></form>
      </section>
    </main>
  );
}
