import { Plugin } from "@react-fluent-edit/core";
import MarkdownLeaf from "../MarkdownLeaf";
import { MarkdownPluginOptions, MarkdownToken } from "../types";
import { decorateMarkdown, handleKeydown } from "../utils";
import withMarkdown from "../withMarkdown";

const tokens: MarkdownToken[] = [
  "strong",
  "em",
  "del",
  "codespan",
  "link",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "marker",
];

function createMarkdownPlugin(options: MarkdownPluginOptions = {}): Plugin {
  return {
    name: "markdown",
    leave: {
      match: ({ leaf }) => tokens.some((key) => leaf[key]),
      component: options.component || MarkdownLeaf,
    },
    override: withMarkdown,
    decorate: decorateMarkdown,
    handlers: { onKeyDown: { handler: handleKeydown } },
    options,
  };
}

export default createMarkdownPlugin;
