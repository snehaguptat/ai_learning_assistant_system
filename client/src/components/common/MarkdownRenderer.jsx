import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighLighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-fg/90 text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-semibold text-fg mt-5 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold text-fg mt-5 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold text-fg mt-4 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-semibold text-fg mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-3 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-accent underline underline-offset-2 decoration-accent/40 hover:decoration-accent"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-outside mb-3 ml-5 marker:text-accent space-y-1"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-outside mb-3 ml-5 marker:text-accent marker:font-mono space-y-1"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-fg" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-accent pl-4 italic text-fg-muted my-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-line">
              <table className="w-full text-sm" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="text-left px-3 py-2 bg-raised font-mono text-[11px] uppercase tracking-wider text-fg-muted border-b border-line"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 border-t border-line" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighLighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  background: "#0b0b0c",
                  fontSize: "0.8125rem",
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighLighter>
            ) : (
              <code
                className="bg-raised border border-line text-accent-hover px-1.5 py-0.5 rounded-md font-mono text-[0.85em]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="bg-[#0b0b0c] border border-line rounded-lg overflow-x-auto font-mono text-sm my-4"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
