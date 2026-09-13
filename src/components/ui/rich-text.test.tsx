import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RichText } from "./rich-text";

describe("RichText", () => {
  it("bolds **terms** and typesets inline $LaTeX$ with KaTeX, interpreting nothing else", () => {
    const html = renderToStaticMarkup(<RichText text="Mechanical energy is **kinetic** plus potential ($E_{mech} = E_k + E_p$) <b>x</b>" />);
    expect(html).toContain("<strong");
    expect(html).toContain("kinetic</strong>");
    expect(html).toContain('class="katex"');
    expect(html).not.toContain("<b>x</b>");
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
  });

  it("leaves a lone dollar sign alone", () => {
    const html = renderToStaticMarkup(<RichText text="It costs $5 to start." />);
    expect(html).toContain("$5 to start.");
    expect(html).not.toContain("katex");
  });
});
