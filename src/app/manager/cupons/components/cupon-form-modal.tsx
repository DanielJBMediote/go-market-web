import { ICuponApi } from "@/api/CuponApi";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCuponsMutation } from "@/hooks/cupons/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cuponSchema = z.object({
  cuponCode: z.string(),
  maxUsed: z.number().min(1),
  expiredDate: z.date(),
  percentDiscount: z.number().min(1).max(100),
});

type CuponFormData = z.infer<typeof cuponSchema>;

interface CuponFormModalProps {
  initialData?: ICuponApi;
}

export function CuponFormModal({ initialData }: CuponFormModalProps) {
  const methods = useForm({
    resolver: zodResolver(cuponSchema),
    defaultValues: { ...initialData },
  });
  const { handleSubmit, register } = methods;

  const { mutateAsync } = useCuponsMutation({ initialData });

  async function handleSubmitCupon(data: CuponFormData) {
    await mutateAsync(data);
  }

  return (
    <DialogContent className="min-w-xl">
      <DialogTitle>{initialData ? "Update Cupon." : "Create new Cupon."}</DialogTitle>
      <Form {...methods}>
        <form onSubmit={handleSubmit(handleSubmitCupon)} className="grid grid-cols-3 gap-2">
          <FormLabel>Cupon Code</FormLabel>
          <FormItem className="col-span-2">
            <Input
              placeholder="Type cupon code, ex: CUPON10, CUPON15..."
              {...register("cuponCode")}
            />
          </FormItem>
          <FormLabel>Max Uses</FormLabel>
          <FormItem className="col-span-2">
            <Input type="number" min={1} {...register("maxUsed", { valueAsNumber: true })} />
          </FormItem>
          <FormLabel>Percent Discount</FormLabel>
          <FormItem className="col-span-2">
            <Input
              type="number"
              min={1}
              max={100}
              {...register("percentDiscount", { valueAsNumber: true })}
            />
          </FormItem>
          <FormLabel>Expired At</FormLabel>
          <FormItem className="col-span-2">
            <Input type="date" {...register("expiredDate")} />
          </FormItem>
        </form>
      </Form>
    </DialogContent>
  );
}
