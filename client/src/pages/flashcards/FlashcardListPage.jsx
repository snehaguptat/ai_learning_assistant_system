import { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService.js";
import Spinner from "../../components/common/Spinner.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard.jsx";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader.jsx";

const FlashcardListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();
        setFlashcardSets(response.data);
        console.log(response);
      } catch (error) {
        toast.error("Failed to fetch flashcard sets");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          title="No flashcard sets found"
          description="You haven't generated any flashcards yet. Go to a document to create your first set."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {flashcardSets.map((set, i) => (
          <div
            key={set._id}
            className="animate-fade-up h-full"
            style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
          >
            <FlashcardSetCard flashcardSet={set} />
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Study"
        title="All flashcard sets"
        subtitle="Pick a set and review it any time."
      />
      {renderContent()}
    </div>
  );
};

export default FlashcardListPage;
