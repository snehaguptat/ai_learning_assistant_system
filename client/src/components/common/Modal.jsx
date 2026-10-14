import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-lg bg-surface border border-line-strong rounded-2xl shadow-pop p-7 z-10 animate-pop">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 btn btn-ghost btn-sm px-0! w-8"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>

          <div className="mb-5 pr-10">
            <h3 className="text-xl font-semibold text-fg">{title}</h3>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
