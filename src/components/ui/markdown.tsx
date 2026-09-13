import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Grown-up Jojo's help replies are markdown in the product (bold, bullet
 * lists, the occasional heading). Rendered with a tight set of elements; raw
 * HTML in the model output is never rendered.
 */
export function Markdown({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("space-y-3 text-[15px] leading-relaxed text-foreground [&_strong]:font-semibold", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-6">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          h1: ({ children }) => <p className="font-semibold">{children}</p>,
          h2: ({ children }) => <p className="font-semibold">{children}</p>,
          h3: ({ children }) => <p className="font-semibold">{children}</p>,
          a: ({ children }) => <span className="underline underline-offset-2">{children}</span>,
          code: ({ children }) => <code className="rounded bg-foreground/5 px-1 py-0.5 font-mono text-[13px]">{children}</code>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
