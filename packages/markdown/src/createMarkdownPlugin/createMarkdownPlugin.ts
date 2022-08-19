import { Plugin } from "@react-fluent-edit/core";
import Element from "../Element";
import Leaf from "../Leaf";
import { decorateMarkdown } from "../utils";

function createMarkdownPlugin(): Plugin {
  return {
    name: "markdown",
    elements: [
      {
        match: ({ element: { type } }) =>
          ["heading", "list", "listItem"].includes(type),
        component: Element,
      },
    ],
    leaves: [
      {
        match: ({ leaf }) =>
          ["strong", "inlineCode", "emphasis", "delete"].some(
            (key) => leaf[key]
          ),
        component: Leaf,
      },
    ],
    decorate: decorateMarkdown,
  };
}

export default createMarkdownPlugin;
