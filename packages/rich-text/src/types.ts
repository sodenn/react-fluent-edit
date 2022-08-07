import { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Path } from "slate";

type MarkFormat = "strong" | "emphasis" | "underline" | "code";

type HeadingFormat = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type ListFormat = "ordered-list" | "unordered-list";

type BlockFormat = HeadingFormat | ListFormat | "block-quote";

type AlignFormat = "left" | "center" | "right" | "justify";

type Format = MarkFormat & BlockFormat & AlignFormat;

interface ActiveMarks {
  code: boolean;
  strong: boolean;
  emphasis: boolean;
  underline: boolean;
}

interface ActiveBlocks {
  h1: boolean;
  h2: boolean;
  blockQuote: boolean;
  orderedList: boolean;
  unorderedList: boolean;
}

interface RichTextHookReturnValue {
  toggleMark: (format: MarkFormat) => void;
  toggleBlock: (format: BlockFormat) => void;
  setActiveBlocksAndMarks: () => void;
  activeBlocks: ActiveBlocks;
  activeMarks: ActiveMarks;
  deleteEmptyListElement: (path: Path) => boolean;
  richTextEnabled: boolean;
  setRichTextEnabled: Dispatch<SetStateAction<boolean>>;
  handleSpacePress: () => boolean;
  handleTabPress: (event: KeyboardEvent<HTMLDivElement>) => boolean;
  handleEnterPress: (event: KeyboardEvent<HTMLDivElement>) => boolean;
}

export {
  MarkFormat,
  HeadingFormat,
  ListFormat,
  BlockFormat,
  AlignFormat,
  ActiveMarks,
  ActiveBlocks,
  Format,
  RichTextHookReturnValue,
};
