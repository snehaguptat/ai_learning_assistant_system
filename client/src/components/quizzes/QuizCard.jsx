import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";

const QuizCard = ({ quiz, onDelete }) => {
  return (
    <div className="group relative card p-5 hover:border-accent/40 hover:bg-raised transition-colors duration-200 flex flex-col justify-between">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 w-8 h-8 flex justify-center items-center rounded-lg text-fg-subtle hover:text-danger hover:bg-danger/10 transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete quiz"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>

      <div className="space-y-4">
        {/* Score badge */}
        <span className="chip chip-accent">
          <Award className="w-3.5 h-3.5" strokeWidth={2.5} />
          Score: {quiz?.score}
        </span>

        <div>
          <h3
            className="text-base font-semibold text-fg mb-1 line-clamp-2 pr-8"
            title={quiz.title}
          >
            {quiz.title ||
              `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
          </h3>
          <p className="eyebrow">
            Created {moment(quiz.createdAt).format("MMM D, YYYY")}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-line">
          <span className="chip">
            {quiz?.questions?.length}{" "}
            {quiz?.questions?.length === 1 ? "Question" : "Questions"}
          </span>
        </div>

        {/* Action Button */}
        <div>
          {quiz?.userAnswers?.length > 0 ? (
            <Link
              to={`/quizzes/${quiz._id}/results`}
              className="btn btn-secondary w-full h-11"
            >
              <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
              View results
            </Link>
          ) : (
            <Link
              to={`/quizzes/${quiz._id}`}
              className="btn btn-primary w-full h-11"
            >
              <Play className="w-4 h-4" strokeWidth={2.5} />
              Start quiz
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
