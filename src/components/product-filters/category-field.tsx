import { ValueTypes, WhereOperatorType } from "@/api/Where";
import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryQuery } from "@/hooks/category/queries";
import { useProductFilters } from "@/hooks/products/filters";
import { useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { ProductFilterForm } from ".";

export function CategoryField() {
  const { control, setValue, formState } = useFormContext<ProductFilterForm>();
  const { filters } = useProductFilters();

  const { refetch: refetchCategories, data: categories } = useCategoryQuery();

  // Agrupa categorias por nome principal
  const groupedCategories = useMemo(
    () =>
      categories.reduce((acc, category) => {
        if (!acc[category.name]) {
          acc[category.name] = [];
        }
        acc[category.name].push(category);
        return acc;
      }, {} as Record<string, typeof categories>),
    [categories]
  );

  const getDefaultValue = useCallback(
    <T extends ValueTypes>(key: string, operator?: WhereOperatorType): T | undefined => {
      const filter = filters.find(
        (f) => f.key === key && (operator ? f.operator === operator : true)
      );
      return filter?.value as T | undefined;
    },
    [filters]
  );

  useEffect(() => {
    if (categories.length > 0 && getDefaultValue<number>("category.id")) {
      setValue("category", getDefaultValue<number>("category.id") + "");
    }
  }, [categories, setValue, getDefaultValue]);

  useEffect(() => {
    if (categories.length == 0) {
      refetchCategories();
    }
  }, [categories, refetchCategories]);

  return (
    <div className="min-w-full">
      <div className="flex justify-between items-baseline">
        <p className="text-muted-foreground">Category:</p>
      </div>
      <FormField
        name="category"
        control={control}
        render={({ field }) => (
          <Select defaultValue={"all"} onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="min-w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(groupedCategories).map(([categoryName, subCategories]) => (
                <SelectGroup key={categoryName}>
                  <SelectSeparator />
                  <SelectLabel className="text-primary">{categoryName}</SelectLabel>
                  {subCategories.map((category) => (
                    <SelectItem
                      className="text-xs"
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.subName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
