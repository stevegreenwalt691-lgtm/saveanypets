import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  body: string;
}

export function MarkdownContent({ body }: MarkdownContentProps) {
  return (
    <div className="flex flex-col gap-4 text-base leading-relaxed text-ink-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mt-2 text-[34px] sm:text-[40px]">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-4 text-2xl sm:text-[28px]">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-2 text-xl">{children}</h3>,
          p: ({ children }) => <p className="text-ink-2">{children}</p>,
          ul: ({ children }) => <ul className="ml-5 flex list-disc flex-col gap-2">{children}</ul>,
          ol: ({ children }) => <ol className="ml-5 flex list-decimal flex-col gap-2">{children}</ol>,
          li: ({ children }) => <li className="text-ink-2">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand underline hover:text-brand-hover"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
