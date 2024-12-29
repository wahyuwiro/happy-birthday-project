import React from 'react';

interface ModalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ModalPopup = ({ isOpen, onClose, onConfirm, message }: ModalPopupProps) => {
  if (!isOpen) return null; // Do not render modal if not open

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;
