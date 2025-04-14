import { Text } from "@/components/ui/text";
import { CheckoutProvider } from "@/contexts/checkout-provider";
import { CartSummary } from "./components/cart-summary";
import { PaymentMethodForm } from "./components/payment-method";
import { ShippingForm } from "./components/shipping-form";

export default function Checkout() {
  return (
    <div className="space-y-4">
      <Text variant="title" color="primary">
        Checkout
      </Text>
      <CheckoutProvider>
        <div className="w-full flex gap-4">
          <div className="w-3/5 flex flex-col gap-6">
            <ShippingForm />
            <PaymentMethodForm />
          </div>
          <div className="w-2/5 rounded-xs shadow ">
            <CartSummary />
          </div>
        </div>
      </CheckoutProvider>
    </div>
  );
}
