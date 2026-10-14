import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

//Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };
  return (
    <div
      className="group relative card h-full p-5 hover:border-accent/40 hover:bg-raised transition-colors duration-200 flex flex-col justify-between cursor-pointer"
      onClick={handleNavigate}
    >
      {/* Header section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="icon-tile icon-tile-accent w-11 h-11 group-hover:bg-accent group-hover:text-accent-fg transition-colors duration-200">
            <FileText className="w-5 h-5" strokeWidth={2} />
          </div>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 w-8 h-8 flex items-center justify-center text-fg-subtle hover:text-danger hover:bg-danger/10 rounded-lg transition-all duration-150"
            aria-label="Delete document"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="text-base font-semibold text-fg truncate mb-1"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* Document info */}
        <div className="font-mono text-xs text-fg-subtle mb-4">
          {document.fileSize !== undefined && (
            <span>{formatFileSize(document.fileSize)}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-2">
        {document.flashcardCount !== undefined && (
          <span className="chip">
            <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
            {document.flashcardCount}
            {document.flashcardCount === 1 ? " Flashcard" : " Flashcards"}
          </span>
        )}
        {document.quizCount !== undefined && (
          <span className="chip">
            <BrainCircuit className="w-3.5 h-3.5" strokeWidth={2} />
            {document.quizCount}
            {document.quizCount === 1 ? " Quiz" : " Quizzes"}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-line">
        <div className="flex items-center gap-1.5 text-xs text-fg-subtle">
          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Uploaded {moment(document.createdAt).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
