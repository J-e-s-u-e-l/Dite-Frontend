interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-md shadow-md w-80">
      <p className="text-gray-800 mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-60"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 rounded-md hover-bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;
