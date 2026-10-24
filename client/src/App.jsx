import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DashBoard = lazy(() => import("./pages/dashboard/DashBoard"));
const DocumentListPage = lazy(
  () => import("./pages/documents/DocumentListPage"),
);
const DocumentsDetailPage = lazy(
  () => import("./pages/documents/DocumentsDetailPage"),
);
const FlashcardListPage = lazy(
  () => import("./pages/flashcards/FlashcardListPage.jsx"),
);
const FlashcardPage = lazy(
  () => import("./pages/flashcards/FlashcardPage.jsx"),
);
const QuizTakePage = lazy(() => import("./pages/quizzes/QuizTakePage"));
const QuizResultPage = lazy(() => import("./pages/quizzes/QuizResultPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));

const PageLoader = () => {
  <div className="flex items-center justify-center h-screen bg-canvas">
    <div className="flex items-center gap-3 text-fg-muted">
      <div className="spin-sm text-accent" />
      <span className="eyebrow">Loading</span>
    </div>
  </div>;
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-canvas">
        <div className="flex items-center gap-3 text-fg-muted">
          <div className="spin-sm text-accent" />
          <span className="eyebrow">Loading</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="documents/:id" element={<DocumentsDetailPage />} />
            <Route path="/flashcards" element={<FlashcardListPage />} />
            <Route
              path="/documents/:id/flashcards"
              element={<FlashcardPage />}
            />
            <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
            <Route
              path="/quizzes/:quizId/results"
              element={<QuizResultPage />}
            />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
