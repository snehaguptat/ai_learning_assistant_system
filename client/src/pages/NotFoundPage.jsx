import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen bg-canvas flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-60" />
      <div className="absolute inset-x-0 top-0 h-96 bg-ember" />
      <div className="relative text-center animate-fade-up">
        <p className="eyebrow text-accent! mb-4">Error 404</p>
        <h1 className="font-display text-[8rem] md:text-[12rem] font-semibold leading-none tracking-tighter text-fg">
          4<span className="text-accent">0</span>4
        </h1>
        <p className="text-fg-muted mt-4 mb-10">
          This page doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
