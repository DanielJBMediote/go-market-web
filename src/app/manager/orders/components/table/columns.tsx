import { IOrderApi, IOrderItemApi } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TableOrderActions } from "./actions";
import { OrderStatusFlag, OrderStatusKey } from "./order-status-flag";
import { PaymentMethodFlag } from "./payment-method-flag";

export const orderColumns: ColumnDef<IOrderApi>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <div className="flex gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="cursor-pointer"
          />
          #
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="cursor-pointer"
          />
          {row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "uuid",
    header: "UUID",
    cell: ({ cell }) => <Text variant="paragraph">{cell.getValue<string>()}</Text>,
  },
  {
    accessorKey: "client.name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Client
          <Button
            size="icon"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="text-primary" />
          </Button>
        </div>
      );
    },
    cell: ({ cell }) => <Text variant="paragraph">{cell.getValue<string>()}</Text>,
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ cell }) => {
      const status = cell.getValue<string>() as OrderStatusKey;
      return <OrderStatusFlag status={status} />;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ cell }) => {
      const paymentMethod = cell.getValue<string>();
      return <PaymentMethodFlag method={paymentMethod} />;
    },
  },
  {
    accessorKey: "items",
    header: "Quantity",
    cell: ({ cell }) => <Text>{cell.getValue<IOrderItemApi[]>().length} products</Text>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <TableOrderActions row={row} />,
  },
];
