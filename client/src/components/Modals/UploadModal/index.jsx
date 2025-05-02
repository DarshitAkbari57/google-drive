import { Upload, X } from "lucide-react";
import { useRef } from "react";

export const UploadModal = ({ isOpen, onClose, onDrop }) => {
  const modalRef = useRef();

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onDrop(files);
    onClose();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onDrop(files);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-400 dark:text-gray-300 z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Upload Files
        </h2>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 rounded-lg flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 relative">
          <Upload className="w-10 h-10 mb-2" />
          <p>Drag and drop your files here</p>
          <p className="text-xs mt-1">or click to browse</p>
          <input
            type="file"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  );
};
