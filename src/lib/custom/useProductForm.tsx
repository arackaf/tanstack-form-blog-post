import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import type { FC } from "react";

export interface Product {
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

const { fieldContext, useFieldContext, formContext } = createFormHookContexts();

const BasicTextField: FC<{ label: string }> = (props) => {
  const { label } = props;
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
    </div>
  );
};

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { BasicTextField },
  formComponents: {},
});

export const useProductForm = (onSubmit: (value: Product) => void) => {
  return useAppForm({
    defaultValues: defaultProduct,

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });
};

export type ProductForm = ReturnType<typeof useProductForm>;
