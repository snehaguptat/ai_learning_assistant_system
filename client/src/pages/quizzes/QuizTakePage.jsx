import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import toast from "react-hot-toast";
import Button from "../../components/common/Button.jsx";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    const answeredCount = Object.keys(selectedAnswers).length;
    console.log(answeredCount);
    if (answeredCount !== quiz.questions.length) {
      toast.error("Please answer all the questions to submit quiz");
      setSubmitting(false);
      return;
    }
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map(
        (questionId) => {
          const question = quiz.questions.find((q) => q._id === questionId);
          const questionIndex = quiz.questions.findIndex(
            (q) => q._id === questionId,
          );
          const optionIndex = selectedAnswers[questionId];
          const selectedAnswer = question.options[optionIndex];

          return { questionIndex, selectedAnswer };
        },
      );

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success("Quiz submitted successfully.");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error("Failed to submit quiz, Try again!");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-fg-muted text-lg">
            Quiz not found or has no questions.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader eyebrow="Quiz" title={quiz.title || "Take Quiz"} />

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-fg">
            Question{" "}
            <span className="text-accent">{currentQuestionIndex + 1}</span> /{" "}
            {quiz.questions.length}
          </span>
          <span className="eyebrow">{answeredCount} answered</span>
        </div>

        <div className="relative h-1 bg-raised rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={currentQuestion._id}
        className="card p-6 md:p-8 animate-fade-up"
      >
        <span className="chip chip-accent mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          Question {currentQuestionIndex + 1}
        </span>

        <h3 className="text-xl md:text-2xl font-semibold text-fg mb-8 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;
            return (
              <label
                key={index}
                className={`group relative flex items-center gap-4 px-4 py-3.5 border rounded-xl cursor-pointer transition-colors duration-150 
                  ${
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-line bg-canvas hover:border-line-strong hover:bg-raised"
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="sr-only"
                />

                {/* Option letter / radio */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-md border flex items-center justify-center font-mono text-xs transition-colors duration-150 ${
                    isSelected
                      ? "border-accent bg-accent text-accent-fg font-medium"
                      : "border-line-strong text-fg-subtle group-hover:border-accent/60 group-hover:text-fg"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option Text */}
                <span
                  className={`text-sm font-medium transition-colors duration-150 ${
                    isSelected ? "text-fg" : "text-fg-muted group-hover:text-fg"
                  }`}
                >
                  {option}
                </span>

                {/* Selected Checkmark */}
                {isSelected && (
                  <CheckCircle2
                    className="ml-auto w-5 h-5 text-accent"
                    strokeWidth={2.25}
                  />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          variant="secondary"
          className="h-11 px-5"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          Previous
        </Button>
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="btn btn-primary btn-lg"
          >
            {submitting ? (
              <>
                <div className="spin-sm" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                Submit quiz
              </>
            )}
          </button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={
              currentQuestionIndex === quiz.questions.length - 1 || submitting
            }
            className="h-11 px-5"
          >
            Next
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Button>
        )}
      </div>

      {/* Question navigation dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
        {quiz.questions.map((_, index) => {
          const isAnsweredQuestion = selectedAnswers.hasOwnProperty(
            quiz.questions[index]._id,
          );
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-8 h-8 rounded-md border font-mono text-xs transition-colors duration-150 ${
                isCurrent
                  ? "bg-accent border-accent text-accent-fg font-medium"
                  : isAnsweredQuestion
                    ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                    : "bg-raised border-line text-fg-subtle hover:text-fg hover:border-line-strong"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTakePage;
