import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import quizService from "../../services/quizService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizResults();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!results || !results.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-fg-muted text-lg">Quiz result not found.</p>
        </div>
      </div>
    );
  }

  const {
    data: { quiz, results: detailedResults },
  } = results;

  console.log(quiz);
  console.log(results);

  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter((r) => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";

    return "text-danger";
  };

  const getScoreToMessage = (score) => {
    if (score >= 90) return "Outstanding!";
    if (score >= 80) return "Great job!";
    if (score >= 70) return "Good work!";
    if (score >= 60) return "Not bad!";

    return "Keep practicing!";
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to={`/documents/${quiz.document}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to document
        </Link>
      </div>

      {/* PageHeader */}
      <PageHeader eyebrow="Results" title={`${quiz.title || "Quiz"} results`} />

      {/* Score card */}
      <div className="relative overflow-hidden card p-8 mb-10 animate-fade-up">
        <div className="absolute inset-x-0 top-0 h-40 bg-ember" />
        <div className="relative text-center">
          <div className="icon-tile icon-tile-accent w-12 h-12 rounded-xl mb-5">
            <Trophy className="w-6 h-6" strokeWidth={2} />
          </div>

          <p className="eyebrow mb-3">Your score</p>
          <div
            className={`font-display text-8xl font-semibold tracking-tight leading-none tabular-nums ${getScoreColor(score)}`}
          >
            {score}
            <span className="text-5xl opacity-60">%</span>
          </div>

          <p className="text-lg font-medium text-fg mt-4">
            {getScoreToMessage(score)}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
            <span className="chip h-9 px-4 text-sm">
              <Target className="w-4 h-4" strokeWidth={2} />
              {totalQuestions} total
            </span>

            <span className="chip chip-success h-9 px-4 text-sm">
              <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              {correctAnswers} correct
            </span>

            <span className="chip chip-danger h-9 px-4 text-sm">
              <XCircle className="w-4 h-4" strokeWidth={2} />
              {incorrectAnswers} incorrect
            </span>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 text-accent" strokeWidth={2} />
          <h3 className="text-xl font-semibold text-fg">Detailed review</h3>
        </div>

        {detailedResults.map((result, index) => {
          const userAnswerIndex = result.options.findIndex(
            (opt) => opt === result.selectedAnswer,
          );

          const correctAnswerIndex = result.correctAnswer.startsWith("O")
            ? parseInt(result.correctAnswer.substring(1) - 1)
            : result.options.findIndex((opt) => opt === result.correctAnswer);

          const isCorrect = result.isCorrect;

          return (
            <div key={index} className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex-1">
                  <span className="chip font-mono text-[10px] uppercase tracking-wider mb-3">
                    Question {index + 1}
                  </span>
                  <h4 className="text-lg font-semibold text-fg leading-snug">
                    {result.question.question}
                  </h4>
                </div>

                <div
                  className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${
                    isCorrect
                      ? "bg-success/10 border-success/30 text-success"
                      : "bg-danger/10 border-danger/30 text-danger"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" strokeWidth={2.25} />
                  ) : (
                    <XCircle className="w-5 h-5" strokeWidth={2.25} />
                  )}
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                {result.options.map((option, optIndex) => {
                  const isCorrectOption = optIndex === correctAnswerIndex;
                  const isUserAnswer = optIndex === userAnswerIndex;
                  const isWrongAnswer = isUserAnswer && !isCorrect;

                  return (
                    <div
                      key={optIndex}
                      className={`relative px-4 py-3 rounded-lg border ${
                        isCorrectOption
                          ? "bg-success/10 border-success/40"
                          : isWrongAnswer
                            ? "bg-danger/10 border-danger/40"
                            : "bg-canvas border-line"
                      }`}
                    >
                      <div className="flex justify-between items-center gap-3">
                        <span
                          className={`text-sm font-medium ${
                            isCorrectOption
                              ? "text-success"
                              : isWrongAnswer
                                ? "text-danger"
                                : "text-fg-muted"
                          }`}
                        >
                          {option}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {isCorrectOption && (
                            <span className="chip chip-success h-5 text-[11px]">
                              <CheckCircle2
                                className="w-3 h-3"
                                strokeWidth={2.5}
                              />
                              Correct
                            </span>
                          )}
                          {isWrongAnswer && (
                            <span className="chip chip-danger h-5 text-[11px]">
                              <XCircle className="w-3 h-3" strokeWidth={2.5} />
                              Your answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="p-4 bg-canvas border border-line border-l-2 border-l-accent rounded-lg">
                  <div className="flex items-start gap-3">
                    <BookOpen
                      className="w-4 h-4 text-accent mt-0.5 shrink-0"
                      strokeWidth={2.25}
                    />
                    <div className="flex-1">
                      <p className="eyebrow mb-1.5">Explanation</p>
                      <p className="text-sm text-fg-muted leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mt-10 flex justify-center">
        <Link
          to={`/documents/${quiz.document}`}
          className="btn btn-primary btn-lg"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Return to document
        </Link>
      </div>
    </div>
  );
};

export default QuizResultPage;
