import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ModalType = "info" | "warning" | "success" | "error";

type ModalProps = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: ModalType;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  onClose,
  type = "info",
}) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500); // Remove animation after 500ms
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Define modal styles and animations based on the type
  const typeStyles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      title: "Info",
      animation: "animate-fade-in",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      title: "Warning",
      animation: "animate-bounce-shake",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      title: "Success",
      animation: "animate-scale-up",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      title: "Error",
      animation: "animate-slide-in",
    },
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-10 z-50">
      <div
        className={`${currentStyle.bg} ${
          currentStyle.border
        } rounded-lg p-4 max-w-sm w-full shadow-lg transform transition-all ${
          showAnimation ? currentStyle.animation : ""
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          {/* <h2 className={`${currentStyle.text} font-semibold`}>
            {currentStyle.title}
          </h2> */}
          <button
            onClick={onClose}
            className={`${currentStyle.text} hover:text-opacity-70 focus:outline-none ml-auto`}
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <p className={`${currentStyle.text} mb-4`}>{message}</p>
      </div>
    </div>
  );
};

export default Modal;
