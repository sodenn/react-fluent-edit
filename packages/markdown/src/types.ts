import { CSSProperties } from "react";

interface MarkdownPluginOptions {
  styles: {
    h1: CSSProperties;
    h2: CSSProperties;
    h3: CSSProperties;
    h4: CSSProperties;
    h5: CSSProperties;
    h6: CSSProperties;
    codespan: CSSProperties;
    marker: CSSProperties;
  };
}

export { MarkdownPluginOptions };
