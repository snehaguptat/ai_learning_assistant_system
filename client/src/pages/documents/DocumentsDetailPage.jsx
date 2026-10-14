import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService.js";
import Spinner from "../../components/common/Spinner.jsx";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import Tabs from "../../components/common/Tabs.jsx";
import ChatInterface from "../../components/chat/ChatInterface.jsx";
import AIActions from "../../components/ai/AIActions.jsx";
import FlashcardManager from "../../components/flashcards/FlashcardManager.jsx";
import QuizManager from "../../components/quizzes/QuizManager.jsx";

const DocumentsDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch document details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentDetails();
  }, [id]);

  // Helper function to get the full pdf url
  const getPDFUrl = () => {
    if (!document?.data?.fileUrl) return null;

    const fileUrl = document.data.fileUrl;
    return fileUrl;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.data || !document.data.fileUrl) {
      return (
        <div className="text-center p-10 text-fg-muted text-sm card">
          PDF not available.
        </div>
      );
    }
    const pdfUrl = getPDFUrl();

    return (
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 h-12 bg-raised border-b border-line">
          <span className="eyebrow">Document viewer</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium transition-colors duration-150"
          >
            <ExternalLink size={15} />
            Open in new tab
          </a>
        </div>
        <div className="bg-canvas p-2">
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh] bg-white rounded-lg"
            title="PDF viewer"
            frameBorder="0"
            style={{
              colorScheme: "light",
            }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />;
  };

  const renderAIActions = () => {
    return <AIActions />;
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  };
  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AIActions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return (
      <div className="text-center p-10 text-fg-muted text-sm">
        Document not found.
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          to={"/documents"}
          className="group inline-flex items-center gap-2 text-sm text-fg-muted hover:text-accent transition-colors duration-150"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to documents
        </Link>
      </div>
      <PageHeader eyebrow="Document" title={document.data.title} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentsDetailPage;
