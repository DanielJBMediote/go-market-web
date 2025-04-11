"use client";

import { Dialog } from "@/components/ui/dialog";
import { useModal } from "@/contexts/modal-provider";

export function GlobalModal() {
  const { isOpen, closeModal, modalContent } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      {modalContent}
    </Dialog>
  );
}
