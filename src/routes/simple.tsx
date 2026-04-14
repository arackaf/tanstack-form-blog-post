import { createFileRoute } from "@tanstack/react-router";

import { useStore } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { Textarea } from "#/components/ui/textarea";
import { cn } from "#/lib/utils";
import type { FC } from "react";
import { useProductForm, type ProductForm } from "#/lib/simple/useProductForm";

export const Route = createFileRoute("/simple")({
  component: SimplePage,
});

function SimplePage() {
  const form = useProductForm((product) => {
    console.log("Submitting product", product);
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
            validators={{
              onSubmit: ({ value }) => {
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
              onSubmit: ({ value }) => {
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
              </div>
            )}
          />
          <form.Field
            name="added"
            validators={{
              onSubmit: ({ value }) => {
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
          {/* <DescriptionFieldUseStore form={form} /> */}
          <DescriptionFieldSubscribe form={form} />
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

          <ProductMetadata form={form} />

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

const DescriptionFieldUseStore: FC<{ form: ProductForm }> = (props) => {
  const { form } = props;

  //const price = form.getFieldValue("price");
  const price = useStore(form.store, (state) => state.values.price);
  const descriptionRequired = typeof price === "number" && price > 50;

  return (
    <form.Field
      name="description"
      validators={{
        onSubmit: ({ value }) => {
          const price = form.getFieldValue("price");
          const descriptionRequired = typeof price === "number" && price > 50;

          if (descriptionRequired && !value) {
            return "Description is required when price is greater than $50";
          }
        },
      }}
      children={(field) => (
        <div className="flex flex-col gap-1">
          {descriptionRequired && <p className="text-yellow-800">Description is required when price is greater than $50</p>}
          <Label htmlFor={field.name}>Description</Label>
          <Textarea
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            placeholder="Short product description"
          />
          {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
        </div>
      )}
    />
  );
};

const DescriptionFieldSubscribe: FC<{ form: ProductForm }> = (props) => {
  const { form } = props;

  return (
    <form.Subscribe selector={(formState) => ({ price: formState.values.price })}>
      {({ price }) => {
        const descriptionRequired = typeof price === "number" && price > 50;
        return (
          <form.Field
            name="description"
            validators={{
              onSubmit: ({ value }) => {
                const price = form.getFieldValue("price");
                const descriptionRequired = typeof price === "number" && price > 50;

                if (descriptionRequired && !value) {
                  return "Description is required when price is greater than $50";
                }
              },
            }}
            children={(field) => (
              <div className="flex flex-col gap-1">
                {descriptionRequired && <p className="text-yellow-800">Description is required when price is greater than $50</p>}
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Short product description"
                />
                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
              </div>
            )}
          />
        );
      }}
    </form.Subscribe>
  );
};

const ProductMetadata: FC<{ form: ProductForm }> = ({ form }) => {
  return (
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
                      onSubmit: ({ value }) => {
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
                      onSubmit: ({ value }) => {
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
  );
};
