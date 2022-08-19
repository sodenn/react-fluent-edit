type MarkFormat = "strong" | "emphasis" | "delete" | "inlineCode";

type HeadingFormat = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type ListFormat = "ordered-list" | "unordered-list";

type BlockFormat = HeadingFormat | ListFormat | "block-quote";

type AlignFormat = "left" | "center" | "right" | "justify";

type Format = MarkFormat & BlockFormat & AlignFormat;

export {
  MarkFormat,
  HeadingFormat,
  ListFormat,
  BlockFormat,
  AlignFormat,
  Format,
};
