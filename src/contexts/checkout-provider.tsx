"use client";

import { PaymentMethod } from "@/api/OrderApi";
import { IProductApi } from "@/api/ProductApi";
import { Form } from "@/components/ui/form";
import { useOrderMutation } from "@/hooks/orders/mutations";
import { notifyFormErrors } from "@/utils/notifyFormFieldErros";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, PropsWithChildren, useContext } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthentication } from "./auth-provider";

const checkoutSchema = z.object({
  address: z.object({
    postalCode: z.string(),
    country: z.string(),
    city: z.string(),
    neightboor: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
  }),
  paymentMethod: z.nativeEnum(PaymentMethod),
  items: z
    .array(
      z.object({
        product: z.custom<IProductApi>(),
        quantity: z.number(),
      })
    )
    .default([]),
  totalAmount: z.number().default(0),
  discount: z.number().default(0),
  taxes: z.number().default(0),
});

export type CheckoutContextForm = z.infer<typeof checkoutSchema>;

interface CheckoutContextProps {
  onSubmit: (data: CheckoutContextForm) => Promise<void>;
  isSubmiting: boolean;
}

const CheckoutContext = createContext({} as CheckoutContextProps);

export function CheckoutProvider({ children }: PropsWithChildren) {
  const { userContext } = useAuthentication();

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  const { mutateAsync, isPending } = useOrderMutation();

  async function onSubmit(data: CheckoutContextForm) {
    if (!userContext) {
      toast.error("You may be logged before procced to chackout!");
      return;
    }
    const body = {
      client: {
        id: userContext.id,
      },
      items: data.items,
      paymentMethod: data.paymentMethod,
      shippingAddress: formatShippingAddress(data),
      totalAmount: data.totalAmount,
      discount: data.discount,
      taxes: data.taxes,
    };

    await mutateAsync(body);
  }

  function formatShippingAddress({ address }: Pick<CheckoutContextForm, "address">): string {
    const { street, number, complement, neightboor, city, postalCode, country } = address;
    const parts = [`${street}, ${number}`, complement, neightboor, city, postalCode, country];
    return parts.filter(Boolean).join(" - ");
  }

  const onError = (errors: FieldErrors<CheckoutContextForm>) => {
    notifyFormErrors(errors);
  };

  const value: CheckoutContextProps = { onSubmit, isSubmiting: isPending };

  return (
    <CheckoutContext.Provider value={value}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>{children}</form>
      </Form>
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckoutContext must be used inside CheckoutProvider");
  return context;
}
