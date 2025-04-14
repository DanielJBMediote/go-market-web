import { Banknote, CreditCard, DollarSign, PiggyBank } from "lucide-react";

const methods = [
  {
    icon: DollarSign,
    name: "Cash",
    value: "cash",
  },
  {
    icon: CreditCard,
    name: "Credit Card",
    value: "credit_card",
  },
  {
    icon: Banknote,
    name: "Debit Card",
    value: "debit_card",
  },
  {
    icon: null,
    name: "PayPal",
    value: "paypal",
  },
  {
    icon: PiggyBank,
    name: "Bank Transfer",
    value: "bank_transfer",
  },
];

interface PaymentMethodFlagProps {
  method: string;
}

export function PaymentMethodFlag({ method }: PaymentMethodFlagProps) {
  const methodDetails = methods.find((m) => m.value === method.toLowerCase());
  if (!methodDetails) return null;

  return (
    <div className="flex gap-2 items-center w-fit rounded bg-secondary-foreground hover:bg-secondary-foreground/90 text-white px-3">
      {methodDetails.icon && <methodDetails.icon size={16} />}
      <span>{methodDetails.name}</span>
    </div>
  );
}
