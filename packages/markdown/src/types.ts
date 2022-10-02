import { CustomText } from "@react-fluent-edit/core";
import { CSSProperties, FunctionComponent } from "react";
import { RenderLeafProps } from "slate-react";

type MarkdownToken = keyof Pick<
  CustomText,
  | "strong"
  | "em"
  | "del"
  | "codespan"
  | "link"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "marker"
>;

type MarkdownDisabledKey = MarkdownToken | "list";

type MarkdownDisabled = {
  [key in MarkdownDisabledKey]?: boolean;
};

type MarkdownStyles = {
  [key in Exclude<
    MarkdownToken,
    "link" | "strong" | "em" | "del"
  >]?: CSSProperties;
};

interface MarkdownPluginOptions {
  disabled?: MarkdownDisabled;
  styles?: MarkdownStyles;
  component?: FunctionComponent<RenderLeafProps>;
}

export type {
  MarkdownPluginOptions,
  MarkdownToken,
  MarkdownDisabledKey,
  MarkdownDisabled,
  MarkdownStyles,
};
