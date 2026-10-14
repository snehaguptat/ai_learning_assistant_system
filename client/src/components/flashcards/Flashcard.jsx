import React, { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div className="relative w-full h-80" style={{ perspective: "1200px" }}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-gpu cursor-pointer`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of the card (Question) */}
        <div
          className="absolute inset-0 w-full h-full bg-surface border border-line-strong rounded-2xl shadow-pop p-7 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="eyebrow text-accent!">Question</span>
              {flashcard?.difficulty && (
                <span className="chip font-mono text-[10px] uppercase tracking-wider">
                  {flashcard.difficulty}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              aria-label="Star flashcard"
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-150 ${
                flashcard.isStarred
                  ? "bg-accent/10 border-accent/40 text-accent"
                  : "bg-raised border-line text-fg-subtle hover:text-accent hover:border-accent/40"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question content */}
          <div className="flex-1 flex items-center justify-center px-2 py-6 overflow-y-auto">
            <p className="font-display text-xl md:text-2xl font-semibold text-fg text-center leading-snug tracking-tight">
              {flashcard.question}
            </p>
          </div>

          {/* Flip indicator */}
          <div className="flex items-center justify-center gap-2 eyebrow">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Click to reveal answer</span>
          </div>
        </div>

        {/* Back of the card (Answer) */}
        <div
          className="absolute inset-0 w-full h-full bg-accent text-accent-fg rounded-2xl shadow-glow p-7 flex flex-col justify-between items-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-start justify-between w-full">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
              Answer
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              aria-label="Star flashcard"
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-150 ${
                flashcard.isStarred
                  ? "bg-black/20 border-black/30 text-accent-fg"
                  : "bg-black/10 border-black/10 text-accent-fg/70 hover:bg-black/20 hover:text-accent-fg"
              }`}
            >
              <Star
                className="w-4 h-4"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer content */}
          <div className="flex-1 flex items-center justify-center px-2 py-6 overflow-y-auto">
            <p className="text-base md:text-lg text-center leading-relaxed font-semibold">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip indicator */}
          <div className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
