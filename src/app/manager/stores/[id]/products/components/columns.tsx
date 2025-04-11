import { API_URL } from "@/api";
import { ICategoryApi } from "@/api/CategoryApi";
import { IProductApi } from "@/api/ProductApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useModal } from "@/contexts/modal-provider";
import { formatCurrency } from "@/utils/math-utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ImageOff, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { DeleteConfirmation } from "./delete-confirmation";
import { ProductFormModal } from "./product-modal-form";

export const columns: ColumnDef<IProductApi>[] = [
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
    accessorKey: "images",
    header: "Image",
    accessorFn: ({ images }) => {
      if (images && images.length) return images[0].file.uuid;
      else return null;
    },
    cell: ({ cell }) => {
      const imageUUID = cell.getValue<string>();
      if (!imageUUID) {
        return <ImageOff className="place-self-center text-muted-foreground" />;
      } else {
        return (
          <Image
            src={`${API_URL}/files/${imageUUID}`}
            alt=""
            width={128}
            height={128}
            className="w-16 h-16 object-contain"
          />
        );
      }
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Product
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
    cell: ({ cell }) => (
      <p className="whitespace-pre-line text-ellipsis">{cell.getValue<string>()}</p>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 py-1">
          Description
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
    cell: ({ cell }) => {
      return (
        <p className="whitespace-pre-line text-ellipsis max-w-lg">{cell.getValue<string>()}</p>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ cell }) => {
      return cell.getValue<boolean>() ? "Yes" : "No";
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1">
          Price
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
    cell: ({ cell, row }) => {
      const price = formatCurrency(cell.getValue<number>());
      const lowest = formatCurrency(row.original.lowestPrice);
      const highest = formatCurrency(row.original.highestPrice);
      return (
        <div className="flex flex-col gap-0.5">
          <p className="text-foreground">{price}</p>
          <div className="flex gap-1 text-xs">
            <p className="flex gap-0.5 items-center">
              <ArrowDown size={8} /> {lowest}
            </p>
            <p className="flex gap-0.5 items-center">
              <ArrowUp size={8} /> {highest}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "timesOrdered",
    header: "Ordered",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const value = row.getValue<ICategoryApi>("category");
      return <div>{value["subName"]}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ cell }) => {
      return cell.getValue<boolean>() ? (
        <div className="flex gap-2 items-center w-20">
          <div className="rounded-full h-2 w-2 bg-green-400" />
          <p className="font-light">Active</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center w-20">
          <div className="rounded-full h-2 w-2 bg-rose-400" />
          <p className="font-light">Inactive</p>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

function Actions({ row }: { row: Row<IProductApi> }) {
  const { openModal } = useModal();

  function handleEditProduct() {
    openModal(<ProductFormModal initialData={row.original} />);
  }

  function handleOpenComfirmDeleteModal() {
    openModal(<DeleteConfirmation product={row.original} />);
  }

  return (
    <div className="flex">
      <Button title="Edit" size="icon" variant="ghost" onClick={handleEditProduct}>
        <Pencil />
      </Button>
      <Button size="icon" title="Delete" variant="ghost" onClick={handleOpenComfirmDeleteModal}>
        <Trash2 className="text-rose-400" />
      </Button>
    </div>
  );
}
