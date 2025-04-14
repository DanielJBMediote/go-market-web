"use client";

import { Dialog } from "@/components/ui/dialog";
import { useModalContext } from "@/contexts/modal-provider";

export function GlobalModal() {
  const { isOpen, closeModal, modalContent } = useModalContext();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      {modalContent}
    </Dialog>
  );
}
