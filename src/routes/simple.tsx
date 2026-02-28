import { createFileRoute } from "@tanstack/react-router";

import { useForm } from "@tanstack/react-form-start";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { Textarea } from "#/components/ui/textarea";
import { cn } from "#/lib/utils";

interface Product {
  name: string;
  price: number;
  added?: Date;
  description: string;
  skuNumber: string;
}
const defaultProduct: Product = {
  name: "",
  price: 0,
  added: undefined,
  description: "",
  skuNumber: "",
};

export const Route = createFileRoute("/simple")({
  component: SimplePage,
});

function SimplePage() {
  const form = useForm({
    defaultValues: defaultProduct,
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <main className="p-8">
      <section className="max-w-xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Product Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Keyboard"
                />
              </div>
            )}
          />
          <form.Field
            name="price"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Price</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min="0"
                  step="0.01"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.valueAsNumber || 0)}
                  placeholder="49.99"
                />
              </div>
            )}
          />
          <form.Field
            name="added"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor="added-date">Added</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="added-date"
                      type="button"
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !field.state.value && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.state.value ? format(field.state.value, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      className="bg-white"
                      mode="single"
                      selected={field.state.value}
                      onSelect={(date) => field.handleChange(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          />
          <form.Field
            name="description"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Short product description"
                />
              </div>
            )}
          />
          <form.Field
            name="skuNumber"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>SKU Number</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="SKU-12345"
                />
              </div>
            )}
          />
          <Button className="cursor-pointer" variant="outline" type="submit">
            Save Product
          </Button>
        </form>
      </section>
    </main>
  );
}
