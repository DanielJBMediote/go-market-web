"use client";

import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { CheckoutContextForm } from "@/contexts/checkout-provider";
import { useFormContext } from "react-hook-form";

export function ShippingForm() {
  const { register } = useFormContext<CheckoutContextForm>();

  return (
    <div className="flex flex-col gap-4 rounded-sm shadow p-6">
      <Text variant="subtitle">Shipping Form</Text>
      <div className="grid grid-cols-4 gap-4">
        <FormItem className="col-span-2">
          <FormLabel htmlFor="postalCode">Post Code</FormLabel>
          <Input
            id="postalCode"
            placeholder="Type your postal code here."
            {...register("address.postalCode")}
          />
        </FormItem>
        <div className="col-span-2" />
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Input placeholder="Ex: Brazil, EUA, France..." {...register("address.country")} />
        </FormItem>
        <FormItem>
          <FormLabel>State</FormLabel>
          <Input placeholder="Ex: Nevasca, São Paulo, Paris..." />
        </FormItem>
        <FormItem>
          <FormLabel>City</FormLabel>
          <Input placeholder="Ex: Rio de Janeiro, Paris..." {...register("address.city")} />
        </FormItem>
        <div />
        <FormItem>
          <FormLabel>Neighboor</FormLabel>
          <Input placeholder="Type the neighboor." {...register("address.neightboor")} />
        </FormItem>

        <FormItem className="col-span-2">
          <FormLabel>Street</FormLabel>
          <Input placeholder="Street Kal-El." {...register("address.street")} />
        </FormItem>
        <FormItem>
          <FormLabel>Number</FormLabel>
          <Input placeholder="Type number." {...register("address.number")} />
        </FormItem>
        <FormItem className="col-span-full">
          <FormLabel>Complement</FormLabel>
          <Input
            placeholder="Residence, Apartment, AirBnB... (Optional)"
            {...register("address.complement")}
          />
        </FormItem>
      </div>
    </div>
  );
}
