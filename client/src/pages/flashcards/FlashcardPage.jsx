import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService.js";
import aiService from "../../services/aiService.js";
import PageHeader from "../../components/common/PageHeader.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";
import Modal from "../../components/common/Modal.jsx";
import Flashcard from "../../components/flashcards/Flashcard.jsx";

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);

      console.log(response.data[0]);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully.");
      fetchFlashcards();
    } catch (error) {
      toast.error("Failed to generate flashcards.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
    );
  };

  const handleReview = async (index) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success("Flashcard reviewed");
    } catch (error) {
      console.error("Failed to review flashcard.");
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStarFlashcard(cardId);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card,
        ),
      );

      toast.success("Flashcard starred status updated.");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards(); // Refatch to show empty state
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const renderFlashcardContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!flashcardSets || flashcards.length === 0) {
      return (
        <EmptyState
          title="No flashcards yet"
          description="Generate flashcards from this document to start studying."
          buttonText={generating ? "Generating..." : "Generate flashcards"}
          onActionClick={generating ? undefined : handleGenerateFlashcards}
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="space-y-8">
        <div className="max-w-lg mx-auto">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={handlePrevCard}
            disabled={flashcards.length <= 1}
            className="h-11 px-5"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            Previous
          </Button>

          <div className="px-4 h-11 flex items-center bg-canvas border border-line rounded-lg font-mono text-sm text-fg">
            <span className="text-accent">{currentCardIndex + 1}</span>
            <span className="mx-1.5 text-fg-subtle">/</span>
            {flashcards.length}
          </div>

          <Button
            variant="secondary"
            onClick={handleNextCard}
            disabled={flashcards.length <= 1}
            className="h-11 px-5"
          >
            Next
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    );
  };

  const hasCards = !loading && flashcardSets && flashcards.length > 0;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to={`/documents/${documentId}`}
          className="group inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors duration-150"
        >
          <ArrowLeft
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to document
        </Link>
      </div>

      <PageHeader eyebrow="Study" title="Flashcards">
        {hasCards && (
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            Delete set
          </Button>
        )}
      </PageHeader>

      {renderFlashcardContent()}

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
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="h-11"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteFlashcardSet}
              disabled={deleting}
              className="h-11"
            >
              {deleting ? (
                <>
                  <div className="spin-sm" />
                  Deleting
                </>
              ) : (
                "Delete set"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;
