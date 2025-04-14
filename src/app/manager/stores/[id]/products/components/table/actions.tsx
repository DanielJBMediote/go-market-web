import { IProductApi } from "@/api/ProductApi";
import { CancelConfirmationDialog } from "@/components/cancel-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useModalContext } from "@/contexts/modal-provider";
import { useProductDeleteMutation } from "@/hooks/products/mutations";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { ProductFormModal } from "../product-modal-form";

export function TableProductActions({ row }: { row: Row<IProductApi> }) {
  const { openModal } = useModalContext();

  const prodId = row.getValue<number>("id");
  const { mutateAsync, isPending } = useProductDeleteMutation({ id: prodId });

  function handleEditProduct() {
    openModal(<ProductFormModal initialData={row.original} />);
  }

  function handleOpenConfirmationDeleteModal() {
    openModal(
      <CancelConfirmationDialog
        title="Are you sure to delete this product?"
        description={`Product: ${row.getValue<string>("name")}.`}
        onConfirm={async () => await mutateAsync()}
      />
    );
  }

  return (
    <div className="flex">
      <Button title="Edit" size="icon" variant="ghost" onClick={handleEditProduct}>
        <Pencil />
      </Button>
      <Button
        size="icon"
        title="Delete"
        variant="ghost"
        onClick={handleOpenConfirmationDeleteModal}
        isLoading={isPending}
      >
        <Trash2 className="text-rose-400" />
      </Button>
    </div>
  );
}
