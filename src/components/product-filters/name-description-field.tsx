import { useFormContext } from "react-hook-form";
import { ProductFilterForm } from ".";
import { Input } from "../ui/input";

export function NameDescriptionField() {
  const { register } = useFormContext<ProductFilterForm>();

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline">
        <p className="text-muted-foreground">Search:</p>
      </div>
      <Input placeholder="Search by Name or Description" {...register("name")} />
    </div>
  );
}
