import { FormField, FormItem, FormLabel } from "@/components/ui/form";
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
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ProductTypeSchema } from ".";

export function CategorySelectFormItem() {
  const methods = useFormContext<ProductTypeSchema>();

  const { data: categories, refetch } = useCategoryQuery();

  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.name]) {
      acc[category.name] = [];
    }
    acc[category.name].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  useEffect(() => {
    if (categories.length == 0) {
      refetch();
    }
  }, [categories, refetch]);

  return (
    <FormField
      name="category"
      control={methods.control}
      render={({ field }) => (
        <FormItem className="col-span-3 space-y-1">
          <FormLabel>Category</FormLabel>
          <Select
            onValueChange={(value) =>
              field.onChange(categories.find((category) => category.id.toString() === value))
            }
            value={field.value && field.value.id.toString()}
          >
            <SelectTrigger className="w-2xs min-w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
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
        </FormItem>
      )}
    />
  );
}
