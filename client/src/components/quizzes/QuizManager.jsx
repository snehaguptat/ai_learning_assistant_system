import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService.js";
import aiService from "../../services/aiService.js";
import Spinner from "../common/Spinner.jsx";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import QuizCard from "./QuizCard.jsx";
import EmptyState from "../common/EmptyState.jsx";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGeneratingModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // fetch all the quizzes for the specific documentId
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizService.getQuizzesForDoc(documentId);
      setQuizzes(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch Quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  // generate quiz handler

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await aiService.generateQuiz(documentId, {
        numQuestions,
      });
      toast.success("Quiz generated successfully!");
      setIsGeneratingModalOpen(false);
      fetchQuizzes();
      console.log(response);
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handlelConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
      const response = await quizService.deleteQuiz(selectedQuiz._id);
      console.log(response);
      toast.success(`${selectedQuiz.title || "Quiz"} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
      setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete quiz!");
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes yet"
          description="Generate a quiz from your document to test your knowledge."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <div className="card p-6 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-fg">Quizzes</h3>
          <p className="eyebrow mt-2">Test what you've learned</p>
        </div>
        <Button onClick={() => setIsGeneratingModalOpen(true)}>
          <Plus size={16} strokeWidth={2.5} />
          Generate quiz
        </Button>
      </div>

      {renderQuizContent()}

      {/* Generate Quiz */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGeneratingModalOpen(false)}
        title="Generate new quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-5">
          <div>
            <label className="field-label">Number of questions</label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              required
              className="field font-mono"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGeneratingModalOpen(false)}
              disabled={generating}
              className="h-11"
            >
              Cancel
            </Button>
            <Button type="submit" disable={generating} className="h-11">
              {generating ? "Generating..." : "Generate quiz"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete selected quiz"
      >
        <div className="space-y-6">
          <p className="text-sm text-fg-muted leading-relaxed">
            Are you sure you want to delete the quiz:{" "}
            <span className="font-semibold text-fg">
              {selectedQuiz?.title || "this quiz"}
            </span>
            {"? "}
            This action cannot be undone.
          </p>
          <div className="flex justify-end items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              variant="secondary"
              disabled={deleting}
              className="h-11"
            >
              Cancel
            </Button>
            <button
              onClick={handlelConfirmDelete}
              disabled={deleting}
              className="btn btn-danger h-11"
            >
              {deleting ? (
                <>
                  <div className="spin-sm" />
                  Deleting...
                </>
              ) : (
                "Delete quiz"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizManager;
