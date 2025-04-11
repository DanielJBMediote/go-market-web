import { FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ProductFilterForm } from ".";

export function StatusField() {
  const { control } = useFormContext<ProductFilterForm>();

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <p className="text-muted-foreground">Status:</p>
      </div>
      <FormField
        name="isActive"
        control={control}
        render={({ field }) => (
          <Select
            defaultValue={undefined}
            onValueChange={(value) => {
              const isActiveValue = value === "all" ? null : value === "true" ? true : false;
              field.onChange(isActiveValue);
            }}
            value={field.value === null ? "all" : field.value ? "true" : "false"} // Exibe o valor atual
          >
            <SelectTrigger className="w-42">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
