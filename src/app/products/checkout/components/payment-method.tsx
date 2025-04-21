"use client";

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";
import { CheckoutContextForm } from "@/contexts/checkout-provider";
import { cn } from "@/lib/utils";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Banknote, CreditCard, DollarSign } from "lucide-react";
import { useFormContext } from "react-hook-form";

export const paymentMethodList = [
  {
    name: "Cash",
    value: "CASH",
    icon: DollarSign,
  },
  {
    name: "Credit Card",
    value: "CREDIT_CARD",
    icon: CreditCard,
  },
  {
    name: "Debit Card",
    value: "DEBIT_CARD",
    icon: Banknote,
  },
];

export function PaymentMethodForm() {
  const { control } = useFormContext<CheckoutContextForm>();

  return (
    <div className="p-6 rounded-sm shadow flex flex-col gap-4">
      <Text variant="subtitle">Payment Method</Text>
      <FormField
        name="paymentMethod"
        control={control}
        // defaultValue={PaymentMethodOptions.CASH}
        render={({ field }) => {
          return (
            <FormItem>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-2 flex-wrap"
              >
                {paymentMethodList.map((item) => (
                  <FormItem key={item.value}>
                    <FormControl>
                      <RadioGroupItem value={item.value} className="hidden" />
                    </FormControl>
                    <FormLabel
                      className={cn(
                        "flex items-center justify-center gap-2 rounded border-2 bg-secondary p-4 text-center shadow-sm cursor-pointer",
                        field.value === item.value
                          ? "border-primary bg-primary/10 dark:text-white text-primary"
                          : "border-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
