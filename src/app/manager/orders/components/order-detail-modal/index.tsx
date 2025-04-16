import { IOrderApi } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { useOrderUpdateStatusMutation } from "@/hooks/orders/mutations";
import { formatCurrency } from "@/utils/math-utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { ButtonOrderStatusAction } from "../table/actions-btn-order-status";

interface OrderDetailModalProps {
  initialData: IOrderApi;
}

export function OrderInfoDetailModal({ initialData }: OrderDetailModalProps) {
  const { mutateAsync } = useOrderUpdateStatusMutation({ id: initialData.id });

  async function handleUpdateOrderStatus() {
    await mutateAsync();
  }

  return (
    <DialogContent className="min-w-2xl">
      <DialogTitle>Order Detail</DialogTitle>
      <div className="grid grid-cols-3 border items-center border-gray-300 p-4">
        <Text variant="span" weight="bold">
          ID
        </Text>
        <div className="col-span-2 flex gap-2 items-center">
          <Text variant="flag">{initialData.uuid}</Text>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(initialData.uuid);
              toast.info("ID copy to clipboard.");
            }}
          >
            <Copy />
          </Button>
        </div>

        {/* Order Status */}
        <Text variant="span" weight="bold">
          Status:
        </Text>
        <Text className="col-span-2">{initialData.status}</Text>

        {/* Client Name */}
        <Text variant="span" weight="bold">
          Client:
        </Text>
        <Text variant="span" className="col-span-2">
          {initialData.client.name}
        </Text>

        {/* Total Amount */}
        <Text variant="span" weight="bold">
          Total Amount:
        </Text>
        <Text variant="span" className="col-span-2">
          {formatCurrency(initialData.totalAmount)}
        </Text>

        {/* Discounts */}
        <Text variant="span" weight="bold">
          Discounts:
        </Text>
        <Text variant="span" className="col-span-2">
          {formatCurrency(initialData.discount)}
        </Text>

        {/* Delivery Date */}
        <Text variant="span" weight="bold">
          Delivery Date:
        </Text>
        {initialData.deliveryDate ? (
          <Text variant="span" className="col-span-2">
            {new Date(initialData.deliveryDate).toLocaleDateString()}
          </Text>
        ) : (
          <Text variant="span" className="col-span-2">
            --
          </Text>
        )}

        {/* Payment Date */}
        <Text variant="span" weight="bold">
          Payment Date:
        </Text>
        {initialData.paymentDate ? (
          <Text variant="span" className="col-span-2">
            {new Date(initialData.paymentDate).toLocaleDateString()}
          </Text>
        ) : (
          <Text variant="span" className="col-span-2">
            --
          </Text>
        )}

        {/* Payment Method */}
        <Text variant="span" weight="bold">
          Payment Method:
        </Text>
        <Text variant="span" className="col-span-2">
          {initialData.paymentMethod}
        </Text>
      </div>

      {/* Items Table */}
      <div className="mt-4">
        <Text variant="span" className="font-bold mb-2">
          Items
        </Text>
        <Table className="table-auto w-full border-collapse border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.store.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.product.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>{formatCurrency(initialData.totalAmount)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <DialogFooter>
        <div className="flex gap-2">
          <ButtonOrderStatusAction status={initialData.status} onClick={handleUpdateOrderStatus} />
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
