// import { OrderStatus } from "@/api/OrderApi";
import { OrderStatusKey } from "@/api/OrderApi";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const statusVariant = cva("rounded-full h-2 w-2", {
  variants: {
    status: {
      PENDING: "bg-yellow-400",
      COMPLETED: "bg-green-400",
      CANCELLED: "bg-red-400",
      PROCESSING: "bg-blue-400",
      SHIPPED: "bg-purple-400",
      DELIVERED: "bg-teal-400",
      REFUNDED: "bg-gray-400",
      FAILED: "bg-black",
    },
  },
  defaultVariants: {
    status: "PENDING",
  },
});

export function OrderStatusFlag({ status }: { status: OrderStatusKey }) {
  const statusColor = statusVariant({ status });
  return (
    <div className="flex gap-2 items-center px-2 py-1">
      <div className={cn(statusColor)} />
      <Text variant="span">{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</Text>
    </div>
  );
}
