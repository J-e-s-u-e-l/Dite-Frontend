"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "../components/common/Modal";

type ModalType = "info" | "warning" | "success" | "error";

type ModalContextType = {
  showModal: (message: string, type?: ModalType) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<ModalType>("info");

  const showModal = (message: string, type: ModalType = "info") => {
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setModalMessage("");
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        message={modalMessage}
        isOpen={isModalOpen}
        onClose={hideModal}
        type={modalType}
      />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
