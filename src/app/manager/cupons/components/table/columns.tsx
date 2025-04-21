import { ICuponApi } from "@/api/CuponApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { TableCuponsActions } from "./actions";

export const columns: ColumnDef<ICuponApi>[] = [
  {
    accessorKey: "id",
    header: ({ table }) => {
      return (
        <div className="flex gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
    accessorKey: "cuponCode",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 min-w-xs">
          Cupon Code
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
  },
  {
    accessorKey: "used",
    header: "Times used",
  },
  {
    accessorKey: "percentDiscount",
    header: "Percent Discount",
    cell: ({ cell }) => <Text>{cell.getValue<number>()}%</Text>,
  },
  {
    accessorKey: "expired",
    header: "Expired",
    cell: ({ cell }) => <Text>{cell.getValue<boolean>() ? "Yes" : "No"}</Text>,
  },
  {
    accessorKey: "expiredDate",
    header: "Expired Date",
    cell: ({ cell }) => {
      const value = cell.getValue<Date>();
      return <Text>{value ? new Date(value).toLocaleDateString() : "--"}</Text>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <TableCuponsActions row={row} />,
  },
];
