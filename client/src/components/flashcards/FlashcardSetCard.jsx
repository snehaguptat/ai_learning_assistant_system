import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed,
  ).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      className="group relative card h-full p-6 cursor-pointer transition-colors duration-200 hover:border-accent/40 hover:bg-raised flex flex-col justify-between"
      onClick={handleStudyNow}
    >
      <div className="space-y-5">
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <div className="icon-tile icon-tile-accent w-11 h-11">
            <BookOpen className="w-5 h-5" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold text-fg line-clamp-2 mb-1"
              title={flashcardSet?.documentId?.title}
            >
              {flashcardSet?.documentId?.title}
            </h3>
            <p className="eyebrow">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <span className="chip">
            {totalCards} {totalCards === 1 ? "Card" : "Cards"}
          </span>
          {reviewedCount > 0 && (
            <span className="chip chip-accent">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
              {progressPercentage}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Progress</span>
              <span className="font-mono text-xs text-fg-muted">
                {reviewedCount}/{totalCards} reviewed
              </span>
            </div>
            <div className="relative h-1.5 w-full bg-raised rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Study Button */}
        <div className="pt-5 border-t border-line">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStudyNow();
            }}
            className="btn btn-outline w-full h-11 group-hover:bg-accent group-hover:text-accent-fg group-hover:border-accent"
          >
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Study now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardSetCard;
