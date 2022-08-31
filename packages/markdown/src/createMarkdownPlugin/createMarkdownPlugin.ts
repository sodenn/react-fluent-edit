import { Plugin } from "@react-fluent-edit/core";
import Leaf from "../Leaf";
import { MarkdownPluginOptions } from "../types";
import { decorateMarkdown } from "../utils";
import withMarkdown from "../withMarkdown";

function createMarkdownPlugin(options?: MarkdownPluginOptions): Plugin {
  return {
    name: "markdown",
    leaves: [
      {
        match: ({ leaf }) =>
          [
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
          ].some((key) => leaf[key]),
        component: Leaf,
      },
    ],
    overrides: [{ handler: withMarkdown }],
    decorate: decorateMarkdown,
    options,
  };
}

export default createMarkdownPlugin;
