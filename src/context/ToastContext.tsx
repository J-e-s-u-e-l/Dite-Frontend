"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../components/common/Toast";

type ToastType = "info" | "warning" | "success" | "error";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  const showToast = (message: string, type: ToastType = "info") => {
    setToastMessage(message);
    setToastType(type);
    setIsToastOpen(true);
  };

  const hideToast = () => {
    setToastMessage("");
    setIsToastOpen(false);
  };

  return (
    <ToastContext.Provider
      value={{ showToast: showToast, hideToast: hideToast }}
    >
      {children}
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={hideToast}
        type={toastType}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
