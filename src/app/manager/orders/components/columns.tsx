import { IOrderApi, IOrderItemApi, OrderStatus } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, Info, Send, X } from "lucide-react";
import { OrderStatusFlag, OrderStatusKey } from "./order-status-flag";

export const orderColumns: ColumnDef<IOrderApi>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer"
        />
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
    cell: ({ cell }) => <Text variant="paragraph">{cell.getValue<string>()}</Text>,
  },
  {
    accessorKey: "items",
    header: "Quantity",
    cell: ({ cell }) => <Text>{cell.getValue<IOrderItemApi[]>().length} products</Text>,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

function Actions({ row }: { row: Row<IOrderApi> }) {
  // const { openModal } = useModal();

  const status = row.original.status;

  function handleEditProduct() {
    // openModal(<ProductFormModal initialData={row.original} />);
  }

  function handleOpenComfirmDeleteModal() {
    // openModal(<DeleteConfirmation product={row.original} />);
  }

  return (
    <div className="flex">
      <Button title="Info" variant="ghost" onClick={handleEditProduct}>
        <Info />
        Info
      </Button>
      {status == OrderStatus.PENDING && (
        <Button title="Delete" variant="ghost" onClick={handleOpenComfirmDeleteModal}>
          <Send className="text-green-400" />
          Send
        </Button>
      )}
      {status == OrderStatus.PROCESSING && (
        <Button title="Delete" variant="ghost" onClick={handleOpenComfirmDeleteModal}>
          <CheckCircle className="text-indigo-400" />
          Approve
        </Button>
      )}
      {status == OrderStatus.FAILED && (
        <Button title="Delete" variant="ghost" onClick={handleOpenComfirmDeleteModal}>
          <Info className="text-rose-400" />
          Report
        </Button>
      )}
      {status == OrderStatus.SHIPPED && (
        <Button title="Delete" variant="ghost" onClick={handleOpenComfirmDeleteModal}>
          <CheckCircle className="text-indigo-400" />
          Mark Completed
        </Button>
      )}

      {[OrderStatus.COMPLETED, OrderStatus.CANCELLED].includes(status) && (
        <Button title="Delete" variant="ghost" onClick={handleOpenComfirmDeleteModal}>
          <X className="text-rose-400" />
          Cancel
        </Button>
      )}
    </div>
  );
}
