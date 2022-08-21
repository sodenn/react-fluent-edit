import { Plugin } from "@react-fluent-edit/core";
import Element from "../Element";
import Leaf from "../Leaf";
import { MarkdownPluginOptions } from "../types";
import {
  decorateMarkdown,
  withMarkdownNodes,
  withoutMarkdownNodes,
} from "../utils";
import withMarkdown from "../withMarkdown";

function createMarkdownPlugin(options?: MarkdownPluginOptions): Plugin {
  return {
    name: "markdown",
    elements: [
      {
        match: ({ element: { type } }) =>
          ["heading", "list", "list_item"].includes(type),
        component: Element,
      },
    ],
    leaves: [
      {
        match: ({ leaf }) =>
          ["strong", "em", "del", "codespan", "link", "marker"].some(
            (key) => leaf[key]
          ),
        component: Leaf,
      },
    ],
    overrides: [{ handler: withMarkdown }],
    beforeSerialize: {
      handler: (nodes) => {
        return withoutMarkdownNodes(nodes);
      },
    },
    afterDeserialize: {
      handler: (nodes) => {
        return withMarkdownNodes(nodes);
      },
    },
    decorate: decorateMarkdown,
    options,
  };
}

export default createMarkdownPlugin;
