import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useProductFilters } from "@/hooks/products/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CategoryField } from "./category-field";
import { NameDescriptionField } from "./name-description-field";
import { PriceFields } from "./price-fields";
import { StatusField } from "./status-field";

// Schema do Zod com tratamento para valores booleanos
const productFilterSchema = z.object({
  name: z.string().nullable(),
  category: z.string().default("all"),
  lowestPrice: z
    .string()
    .nullable()
    .default(null)
    .transform((val) => {
      if (val == null || val == "") return null;
      return Number(val);
    }),
  highestPrice: z
    .string()
    .nullable()
    .default(null)
    .transform((val) => {
      if (val == null || val == "") return null;
      return Number(val);
    }),
  isActive: z.boolean().nullable().default(null), // Aceita true, false ou null
});

export type ProductFilterForm = z.infer<typeof productFilterSchema>;

function Root({ children }: PropsWithChildren) {
  const { setFilter, clearFilters, resetFilter } = useProductFilters();

  const methods = useForm<ProductFilterForm>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      name: "",
      category: "all",
      lowestPrice: null,
      highestPrice: null,
      isActive: null,
    },
  });

  // console.log(getDefaultValue<string>("category.id"));

  function handleSubmitFilters(data: ProductFilterForm) {
    // console.log(data);

    // Aplica os filtros apenas se o valor não for nulo ou vazio
    if (data.name) {
      setFilter("name", data.name, "LIKE");
      // setFilter("description", data.name, "LIKE");
    } else {
      resetFilter("name");
      // removeFilter("description");
    }

    if (data.lowestPrice !== null) {
      setFilter("price", data.lowestPrice, "GREATER_THAN_OR_EQUALS");
    } else {
      resetFilter("price", "GREATER_THAN_OR_EQUALS");
    }

    if (data.highestPrice !== null) {
      setFilter("price", data.highestPrice, "LESS_THAN_OR_EQUALS");
    } else {
      resetFilter("price", "LESS_THAN_OR_EQUALS");
    }

    if (data.isActive !== null) {
      setFilter("isActive", data.isActive, "EQUALS");
    } // Filtro booleanoe
    else {
      resetFilter("isActive");
    }

    if (data.category) {
      if (data.category == "all") {
        resetFilter("category.id");
      } else {
        const categoryId = Number(data.category);
        setFilter("category.id", categoryId, "EQUALS");
      }
    }
  }

  function handleResetFilters() {
    clearFilters();
    methods.reset();
  }

  return (
    <Form {...methods}>
      <form
        className="flex justify-between items-end w-full"
        onSubmit={methods.handleSubmit(handleSubmitFilters)}
      >
        <div className="grid grid-cols-3 gap-2">{children}</div>
        <div className="flex gap-2">
          <Button type="submit">
            <Filter />
            Aplly Filter
          </Button>
          <Button type="button" variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

export const ProductFilter = {
  Root,
  DescriptionField: NameDescriptionField,
  PriceFields,
  CategoryField,
  StatusField,
};
