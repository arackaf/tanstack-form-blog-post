import { useForm } from "@tanstack/react-form";

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

export const useProductForm = (onSubmit: (value: Product) => void) => {
  return useForm({
    defaultValues: defaultProduct,

    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });
};

export type ProductForm = ReturnType<typeof useProductForm>;
