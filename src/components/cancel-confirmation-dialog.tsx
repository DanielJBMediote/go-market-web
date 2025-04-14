import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";

interface CancelonfirmationDialogProps {
  title: string;
  description: string;

  onConfirm: () => void;
  onCancel?: () => void;
  isPending?: boolean;
}

export function CancelConfirmationDialog({
  title,
  description,
  onCancel,
  onConfirm,
  isPending = false,
}: CancelonfirmationDialogProps) {
  return (
    <DialogContent>
      <DialogClose onClick={onCancel} />
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} isLoading={isPending}>
          Confirm
        </Button>
      </div>
    </DialogContent>
  );
}
