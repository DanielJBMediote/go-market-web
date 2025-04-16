import { IOrderApi, OrderStatusKey } from "@/api/OrderApi";
import { CancelConfirmationDialog } from "@/components/cancel-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { useModalContext } from "@/contexts/modal-provider";
import { useOrderCancelMutation, useOrderUpdateStatusMutation } from "@/hooks/orders/mutations";
import { Row } from "@tanstack/react-table";
import { Info, X } from "lucide-react";
import { OrderInfoDetailModal } from "../order-detail-modal";
import { ButtonOrderStatusAction } from "./actions-btn-order-status";

export function TableOrderActions({ row }: { row: Row<IOrderApi> }) {
  const { openModal } = useModalContext();

  const orderId = row.original.id;
  const status = row.getValue<OrderStatusKey>("status");

  function handleShowOrderInfo() {
    openModal(<OrderInfoDetailModal initialData={row.original} />);
  }

  const { mutateAsync: mutateAsyncUpdateStatus } = useOrderUpdateStatusMutation({ id: orderId });
  const { mutateAsync: mutateAsyncCancel } = useOrderCancelMutation({ id: orderId });

  async function handleOnClickOrderStatusOperation() {
    await mutateAsyncUpdateStatus();
  }

  async function handleCancelOperation() {
    openModal(
      <CancelConfirmationDialog
        title="Confirm cancel this Order?"
        description={`Order: ${row.getValue<string>("uuid")}`}
        onConfirm={async () => await mutateAsyncCancel()}
      />
    );
  }

  return (
    <div className="flex gap-0.5">
      <Button title="Info" variant="ghost" onClick={handleShowOrderInfo}>
        <Info />
        Info
      </Button>

      <ButtonOrderStatusAction status={status} onClick={handleOnClickOrderStatusOperation} />

      {!["COMPLETED", "CANCELLED"].includes(status) && (
        <Button title="Delete" variant="ghost" onClick={handleCancelOperation}>
          <X className="text-rose-400" />
          Cancel
        </Button>
      )}
    </div>
  );
}
