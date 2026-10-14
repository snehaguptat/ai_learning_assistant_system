import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService.js";
import aiService from "../../services/aiService.js";
import Spinner from "../common/Spinner.jsx";
import Modal from "../common/Modal.jsx";
import Flashcard from "./Flashcard.jsx";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);
      if (response.count !== 0) setFlashcardSets(response.data);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully.");
      fetchFlashcardSets();
    } catch (error) {
      toast.error(error.message || "Failed to generate Flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length,
      );
      handleReview(currentCardIndex);
    }
  };
  const handlePrevCard = () => {
    if (selectedSet) {
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length,
      );
      handleReview(currentCardIndex);
    }
  };

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error(error.message || "Failed to review flashcard.");
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStarFlashcard(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId
              ? { ...card, isStarred: !card.isStarred }
              : card,
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
      toast.success("Flashcard star status updated!");
    } catch (error) {
      toast.error(error.message || "Failed to update star status.");
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success("Flashcard deleted successfully");
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      setFlashcardSets(
        flashcardSets.filter((flashcard) => flashcard._id !== flashcard._id),
      );
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className="space-y-8">
        {/* Back button */}
        <button
          onClick={() => setSelectedSet(null)}
          className="group inline-flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-accent transition-colors duration-150"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to sets
        </button>

        {/* flashcard display */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4">
          {/* to move to previous card in the current flashcard */}
          <button
            onClick={handlePrevCard}
            disabled={selectedSet.cards.length <= 1}
            className="btn btn-secondary h-11 px-5"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            Previous
          </button>

          <div className="px-4 h-11 flex items-center bg-canvas border border-line rounded-lg font-mono text-sm text-fg">
            <span className="text-accent">{currentCardIndex + 1}</span>
            <span className="mx-1.5 text-fg-subtle">/</span>
            {selectedSet.cards.length}
          </div>
          {/* to move to the next card in the current flashcard set */}
          <button
            onClick={handleNextCard}
            disabled={selectedSet.cards.length <= 1}
            className="btn btn-secondary h-11 px-5"
          >
            Next
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }
    if (flashcardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-14 px-6">
          <div className="icon-tile icon-tile-accent w-14 h-14 rounded-xl mb-6">
            <Brain className="w-6 h-6" strokeWidth={2} />
          </div>

          <h3 className="text-2xl font-semibold text-fg mb-2">
            No flashcards yet
          </h3>
          <p className="text-sm text-fg-muted text-center max-w-sm mb-8 leading-relaxed">
            Generate flashcards from your document to start learning and
            reinforce your knowledge.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="btn btn-primary btn-lg"
          >
            {generating ? (
              <>
                <div className="spin-sm" />
                Generating
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2.25} />
                Generate flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with generate button */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-fg">
              Your flashcard sets
            </h3>
            <p className="eyebrow mt-2">
              {flashcardSets.length}{" "}
              {flashcardSets.length === 1 ? "Set" : "Sets"} available
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="btn btn-primary"
          >
            {generating ? (
              <>
                <div className="spin-sm" />
                Generating
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Generate new set
              </>
            )}
          </button>
        </div>

        {/* Flashcard sets grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.length > 0 &&
            flashcardSets.map((set, index) => (
              <div
                key={set._id}
                onClick={() => handleSelectSet(set)}
                className="p-5 rounded-xl group relative bg-canvas border border-line hover:border-accent/40 cursor-pointer transition-colors duration-200"
              >
                {/* Delete Button */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-fg-subtle hover:text-danger hover:bg-danger/10 rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  onClick={(e) => handleDeleteRequest(e, set)}
                  aria-label="Delete flashcard set"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                </button>

                {/* Set content */}
                <div className="space-y-4">
                  <div className="icon-tile icon-tile-accent w-11 h-11">
                    <Brain className="w-5 h-5" strokeWidth={2} />
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-fg mb-1">
                      Flashcard set {index + 1}
                    </h4>
                    <p className="eyebrow">
                      Created {moment(set.createdAt).format("MMM D, YYYY")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-line">
                    <span className="chip chip-accent">
                      {set.cards.length}{" "}
                      {set.cards.length === 1 ? "Card" : "Cards"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="card p-6 md:p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>
      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete flashcard set"
      >
        <div className="space-y-6">
          <p className="text-sm text-fg-muted leading-relaxed">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all cards will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="btn btn-secondary h-11"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="btn btn-danger h-11"
            >
              {deleting ? (
                <>
                  <div className="spin-sm" />
                  Deleting
                </>
              ) : (
                "Delete set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;
