import React from "react";
import { BrainCircuit, FileText, MessageSquare, Layers } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Bring your own PDFs",
    text: "Upload a document and it's indexed so answers stay grounded in your material.",
  },
  {
    icon: MessageSquare,
    title: "Chat with your notes",
    text: "Ask questions, get summaries, and have any concept explained in context.",
  },
  {
    icon: Layers,
    title: "Flashcards & quizzes",
    text: "Turn any document into study sets and track what you've reviewed.",
  },
];

/**
 * Split-screen shell shared by Login and Signup.
 * Left: brand panel (desktop only). Right: the form passed as children.
 */
const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen bg-canvas text-fg grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-line bg-surface p-12">
        <div className="absolute inset-0 bg-dots opacity-70" />
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-ember" />
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent text-accent-fg">
            <BrainCircuit className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <span className="font-display text-lg font-semibold">
            Learning Assistant
          </span>
        </div>

        <div className="relative max-w-lg">
          <p className="eyebrow text-accent! mb-5">AI-powered studying</p>
          <h2 className="font-display text-5xl xl:text-6xl font-semibold leading-[1.02] tracking-tight">
            Study smarter from your <span className="text-accent">own</span>{" "}
            documents.
          </h2>

          <ul className="mt-12 space-y-6">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="icon-tile icon-tile-accent w-10 h-10">
                  <f.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{f.title}</p>
                  <p className="text-sm text-fg-muted mt-0.5 leading-relaxed">
                    {f.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative eyebrow">Built with React · Node · Gemini</p>
      </aside>

      {/* Form panel */}
      <main className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-x-0 top-0 h-64 bg-ember lg:hidden" />
        <div className="relative w-full max-w-sm animate-fade-up">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-accent-fg">
              <BrainCircuit className="w-5 h-5" strokeWidth={2.25} />
            </div>
            <span className="font-display text-base font-semibold">
              Learning Assistant
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-fg-muted text-sm mt-2 mb-9">{subtitle}</p>

          {children}

          <div className="mt-8 pt-6 border-t border-line">{footer}</div>
          <p className="text-center text-xs text-fg-subtle mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
