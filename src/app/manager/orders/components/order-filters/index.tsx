import { OrderStatus, OrderStatusKey, PaymentMethod } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderFilters } from "@/hooks/orders/filters";
import { ObjectUtls } from "@/utils/object-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const orderFilterSchema = z.object({
  client: z.string().nullable(),
  paymentMethod: z.custom<keyof typeof PaymentMethod>(),
  status: z.custom<OrderStatusKey>(),
});

type OrderFilterForm = z.infer<typeof orderFilterSchema>;

export function OrderFilters() {
  const methods = useForm({
    resolver: zodResolver(orderFilterSchema),
  });

  const { register, control } = methods;

  const { setFilter, resetFilter, clearFilters } = useOrderFilters();

  function handleSubmitFilters(data: OrderFilterForm) {
    if (data.client || data.client !== "") {
      setFilter("client.name", data.client, "LIKE");
    } else {
      resetFilter("client.name");
    }
    if (data.paymentMethod) {
      setFilter("paymentMethod", data.paymentMethod, "EQUALS");
    } else {
      resetFilter("paymentMethod");
    }
    if (data.status) {
      setFilter("status", data.status, "EQUALS");
    } else {
      resetFilter("status");
    }
  }

  function handleResetFilters() {
    clearFilters();
  }

  return (
    <Form {...methods}>
      <form
        className="flex justify-between items-end w-full"
        onSubmit={methods.handleSubmit(handleSubmitFilters)}
      >
        <div className="grid grid-cols-6 gap-2">
          <FormItem className="col-span-3">
            <FormLabel>Client</FormLabel>
            <Input type="text" placeholder="Type client name" {...register("client")} />
          </FormItem>
          <FormItem>
            <FormLabel>Payment Method</FormLabel>
            <FormField
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {ObjectUtls.getKeys(PaymentMethod).map((key) => (
                      <SelectItem key={key} value={key}>
                        {PaymentMethod[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormField
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="min-w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ObjectUtls.getKeys(OrderStatus).map((key) => (
                      <SelectItem key={key} value={key}>
                        {OrderStatus[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormItem>
        </div>
        <div className="flex gap-2 w-fit">
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
