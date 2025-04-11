import { useFormContext } from "react-hook-form";
import { ProductFilterForm } from ".";
import { Input } from "../ui/input";

export function PriceFields() {
  const { register } = useFormContext<ProductFilterForm>();
  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline">
        <p className="text-muted-foreground">Price:</p>
      </div>
      <div className="flex gap-2">
        <Input type="number" placeholder="Min" {...register("lowestPrice")} />
        <Input type="number" placeholder="Max" {...register("highestPrice")} />
      </div>
    </div>
  );
}
