"use client";

import { createContext, PropsWithChildren, ReactNode, useContext, useState } from "react";

interface ModalContextProps {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
}

const ModalContext = createContext({} as ModalContextProps);

export const ModalProvider = ({ children }: PropsWithChildren) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  const value = {
    openModal,
    closeModal,
    isOpen,
    modalContent,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => useContext(ModalContext);
