import React, { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";
import Modal from "../../components/common/Modal";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  //State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  //State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch Documents.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      if (!uploadFile) setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully.");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
      // fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Failed to delete Document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }
    // If there is no document for the user
    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center py-20 bg-dots border border-dashed border-line-strong rounded-2xl">
          <div className="text-center max-w-md px-6">
            <div className="icon-tile icon-tile-accent w-16 h-16 rounded-xl mb-6">
              <FileText className="w-7 h-7" strokeWidth={1.75} />
            </div>
            <h3 className="text-2xl font-semibold text-fg mb-2">
              No documents yet
            </h3>
            <p className="text-sm text-fg-muted mb-8 leading-relaxed">
              Get started by uploading your first PDF document to begin
              learning.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary btn-lg"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      );
    }

    //if there are documents then return document card for all the documents
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documents?.map((doc, i) => (
          <div
            key={doc._id}
            className="animate-fade-up h-full"
            style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
          >
            <DocumentCard document={doc} onDelete={handleDeleteRequest} />
          </div>
        ))}
      </div>
    );
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadFile(null);
    setUploadTitle("");
  };

  return (
    <div className="min-h-screen">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow text-accent! mb-3">Library</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              My documents
            </h1>
            <p className="text-fg-muted text-sm mt-3">
              Manage and organize your learning materials.
            </p>
          </div>
          {/* If there are no documents then show nothing else show upload document option */}
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>
        {/* Document list content */}
        {renderContent()}
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-surface border border-line-strong rounded-2xl shadow-pop p-7 animate-pop">
            {/* Close Button */}
            <button
              onClick={closeUploadModal}
              className="absolute top-5 right-5 btn btn-ghost btn-sm px-0! w-8"
              aria-label="Close"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-10">
              <h2 className="text-xl font-semibold">Upload new document</h2>
              <p className="text-sm text-fg-muted mt-1">
                Add a PDF document to your library.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleFileUpload}
              className="space-y-5"
              id="submitForm"
            >
              {/* Title Input */}
              <div>
                <label className="field-label">Document title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className="field"
                  placeholder="e.g. React Interview Prep"
                />
              </div>
              {/* File upload */}
              <div>
                <label className="field-label">PDF file</label>
                <div className="relative border border-dashed border-line-strong rounded-xl bg-canvas hover:border-accent hover:bg-accent/5 transition-colors duration-200">
                  <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                  <div className="flex flex-col items-center justify-center py-9 px-6">
                    <div className="icon-tile icon-tile-accent w-12 h-12 rounded-xl mb-4">
                      <Upload className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <p className="text-sm font-medium text-fg mb-1 text-center break-all">
                      {uploadFile ? (
                        <span className="text-accent">{uploadFile.name}</span>
                      ) : (
                        <>
                          <span className="text-accent">Click to upload</span>{" "}
                          or drag and drop
                        </>
                      )}
                    </p>
                    <p className="font-mono text-[11px] text-fg-subtle">
                      PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  disabled={uploading}
                  className="btn btn-secondary flex-1 h-11"
                  onClick={closeUploadModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary flex-1 h-11"
                >
                  {uploading ? (
                    <>
                      <div className="spin-sm" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${selectedDoc ? selectedDoc.title : ""}`}
      >
        <div className="space-y-6">
          <p className="text-sm text-fg-muted leading-relaxed">
            Are you sure you want to delete this document? This action cannot be
            undone and this document will be permanently removed.
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
                "Delete document"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentListPage;
