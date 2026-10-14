import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb, Book } from "lucide-react";
import aiService from "../../services/aiService.js";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal.jsx";

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generate Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate Summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }
    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept({
        documentId,
        concept,
      });

      setModalTitle(`Explanation of ${concept}`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain the concept.");
    } finally {
      setLoadingAction(null);
    }
  };
  return (
    <>
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="icon-tile w-10 h-10 bg-accent text-accent-fg border-transparent">
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-fg">AI Assistant</h3>
              <p className="text-fg-subtle text-sm">Powered by Gemini</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid gap-4 md:grid-cols-2">
          {/* Generate summary */}
          <div className="group p-5 bg-canvas rounded-xl border border-line hover:border-accent/40 transition-colors duration-200 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="icon-tile icon-tile-accent w-9 h-9">
                  <BookOpen className="w-4 h-4" strokeWidth={2} />
                </div>
                <h4 className="text-fg font-semibold">Generate summary</h4>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed">
                Get a concise summary of the entire document.
              </p>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={loadingAction === "summary"}
              className="btn btn-primary self-start"
            >
              {loadingAction === "summary" ? (
                <>
                  <div className="spin-sm" />
                  Loading...
                </>
              ) : (
                "Summarize"
              )}
            </button>
          </div>

          {/* Explain concept */}
          <div className="group p-5 bg-canvas rounded-xl border border-line hover:border-accent/40 transition-colors duration-200">
            <form
              onSubmit={handleExplainConcept}
              className="h-full flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="icon-tile icon-tile-accent w-9 h-9">
                    <Lightbulb className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <h4 className="text-fg font-semibold">Explain a concept</h4>
                </div>
                <p className="text-sm text-fg-muted leading-relaxed">
                  Enter a topic or concept from the document to get a detailed
                  explanation.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  disabled={loadingAction === "explain"}
                  className="field flex-1 min-w-0"
                  placeholder="e.g. 'React Hooks'"
                />
                <button
                  type="submit"
                  disabled={loadingAction === "explain" || !concept.trim()}
                  className="btn btn-primary h-11"
                >
                  {loadingAction === "explain" ? (
                    <>
                      <div className="spin-sm" />
                      Loading...
                    </>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Result modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalTitle}
          >
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <MarkdownRenderer content={modalContent} />
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AIActions;
