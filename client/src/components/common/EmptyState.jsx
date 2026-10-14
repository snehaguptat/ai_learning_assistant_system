import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-dots border border-dashed border-line-strong rounded-2xl">
      <div className="icon-tile icon-tile-accent w-14 h-14 rounded-xl mb-6">
        <FileText className="w-6 h-6" strokeWidth={1.75} />
      </div>
      <h3 className="text-xl font-semibold text-fg mb-2">{title}</h3>
      <p className="text-sm text-fg-muted mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      {buttonText && onActionClick && (
        <button onClick={onActionClick} className="btn btn-primary btn-lg">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
