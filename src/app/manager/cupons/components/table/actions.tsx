import { ICuponApi } from "@/api/CuponApi";
import { CancelConfirmationDialog } from "@/components/cancel-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useModalContext } from "@/contexts/modal-provider";
import { Row } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

export function TableCuponsActions({ row }: { row: Row<ICuponApi> }) {
  const { openModal } = useModalContext();

  const cuponId = row.getValue<number>("id");

  function handleEditProduct() {
    // openModal(<CuponFormModal initialData={row.original} />);
  }

  function handleOpenConfirmationDeleteModal() {
    openModal(
      <CancelConfirmationDialog
        title="Are you sure to delete this cupon?"
        description={`Cupon: ${row.getValue<string>("cuponCode")}.`}
        onConfirm={async () => {}}
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
        // isLoading={isPending}
      >
        <Trash2 className="text-rose-400" />
      </Button>
    </div>
  );
}
