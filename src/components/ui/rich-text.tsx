import katex from "katex";
import * as React from "react";

/**
 * Review copy as the product renders it: `**bold**` becomes <strong> and
 * inline LaTeX between single dollar signs (e.g. `$E_{mech} = E_k + E_p$`) is
 * typeset with KaTeX. Nothing else is interpreted; the model's text is never
 * treated as HTML. KaTeX output is generated server-side from a fixed grammar,
 * so it is safe to inject.
 */
export function RichText({ text }: { text: string }) {
  const segments = text.split(/(\$[^$\n]+\$)/g).filter(Boolean);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.length > 2 && seg.startsWith("$") && seg.endsWith("$")) {
          const tex = seg.slice(1, -1);
          let html: string;
          try {
            html = katex.renderToString(tex, { throwOnError: false, output: "html", strict: "ignore" });
          } catch {
            return <React.Fragment key={i}>{seg}</React.Fragment>;
          }
          return <span key={i} className="katex-inline" dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return <Bold key={i} text={seg} />;
      })}
    </>
  );
}

function Bold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-semibold text-foreground">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}
