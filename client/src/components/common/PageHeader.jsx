import React from "react";

const PageHeader = ({ title, subtitle, eyebrow, children }) => {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow text-accent! mb-3">{eyebrow}</p>}
        <h1 className="text-3xl md:text-4xl font-semibold text-fg tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-fg-muted text-sm mt-2">{subtitle}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;
