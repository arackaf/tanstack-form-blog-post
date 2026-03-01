import { createFileRoute } from "@tanstack/react-router";

import { useForm, useStore } from "@tanstack/react-form";
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
  price: number | string;
  added?: Date;
  description: string;
  skuNumber: string;
  metadata: { name: string; value: string }[];
}
const defaultProduct: Product = {
  name: "",
  price: 0,
  added: undefined,
  description: "",
  skuNumber: "",
  metadata: [],
};

export const Route = createFileRoute("/simple")({
  component: SimplePage,
});

function SimplePage() {
  const form = useForm({
    defaultValues: defaultProduct,

    validators: {
      onBlur: ({ value }) => {
        console.log({ value });
        if (value.name && value.name === "TanStack" && value.price !== 9.99) {
          return { price: "TanStack is only $9.99!!!" };
        }
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });
  const formErrorMap = useStore(form.store, (state) => state.errorMap);

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
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Name is required";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Product Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                {field.state.meta.isPristine && <p className="text-gray-500">Pristine</p>}
                {field.state.meta.isTouched && <p className="text-gray-500">Touched</p>}
                {field.state.meta.isDirty && <p className="text-gray-500">Dirty</p>}
              </div>
            )}
          />
          <form.Field
            name="price"
            validators={{
              onBlur: ({ value }) => {
                if (value === "") {
                  return "Required!";
                }
                if (typeof value !== "number") {
                  return "Invalid price";
                }
                if (value === 0) {
                  return "Nothing is free, here!";
                }
                if (value < 0) {
                  return "Bruh ...";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-1">
                <Label htmlFor={field.name}>Price</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step="0.01"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const value = event.target.valueAsNumber;
                    field.handleChange(isNaN(value) ? "" : value);
                  }}
                  placeholder="49.99"
                />
                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                {formErrorMap.onBlur?.price && <p className="text-red-500">{formErrorMap.onBlur.price}</p>}

                {field.state.meta.isPristine && <p className="text-gray-500">Pristine</p>}
                {field.state.meta.isTouched && <p className="text-gray-500">Touched</p>}
                {field.state.meta.isDirty && <p className="text-gray-500">Dirty</p>}
              </div>
            )}
          />
          <form.Field
            name="added"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Required!";
                }
              },
            }}
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
                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
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

          <form.Field name="metadata" mode="array">
            {(field) => (
              <div className="flex flex-col gap-1">
                <Button variant="outline" type="button" onClick={() => field.pushValue({ name: "", value: "" })}>
                  Add Metadata
                </Button>
                {field.state.value.map((_, idx) => {
                  return (
                    <div className="flex gap-1">
                      <div>
                        <form.Field
                          name={`metadata[${idx}].name`}
                          validators={{
                            onBlur: ({ value }) => {
                              if (!value) {
                                return "Name is required";
                              }
                            },
                          }}
                          children={(field) => (
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={field.name}>Name</Label>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                placeholder=""
                              />
                              {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                          )}
                        />
                      </div>
                      <div>
                        <form.Field
                          name={`metadata[${idx}].value`}
                          validators={{
                            onBlur: ({ value }) => {
                              if (!value) {
                                return "Value is required";
                              }
                            },
                          }}
                          children={(field) => (
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={field.name}>Value</Label>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(event) => field.handleChange(event.target.value)}
                                placeholder=""
                              />
                              {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                          )}
                        />
                      </div>
                      <div className="self-end">
                        <Button variant="outline" type="button" onClick={() => field.removeValue(idx)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </form.Field>

          {formErrorMap.onBlur?.price && <p className="text-red-500">{formErrorMap.onBlur.price}</p>}
          <Button
            onClick={async () => {
              await form.validateAllFields("submit");
            }}
            className="cursor-pointer"
            variant="outline"
            type="submit"
          >
            Save Product
          </Button>
        </form>
      </section>
    </main>
  );
}
