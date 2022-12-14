import { useCallback } from "react";
import { Descendant } from "slate";
import { Plugin } from "../types";
import { addRoot, cloneChildren, nodesToText } from "../utils";
import { normalizePlugins } from "../utils/plugin-utils";

function textToNodes(text: string): Descendant[] {
  text = text.replace(/<br>/g, "\n");
  if (!/\n/.test(text)) {
    return [
      {
        type: "paragraph",
        children: [{ text }],
      },
    ];
  }
  return text.split(/\n/g).map((line) => ({
    type: "paragraph",
    children: [{ text: line }],
  }));
}

/**
 * Converts the given data structure into a string.
 */
function useSerialize(plugins: Plugin[]) {
  return useCallback(
    (nodes: Descendant[]): string => {
      nodes = cloneChildren(nodes);
      nodes = normalizePlugins(plugins)
        .map((p) => p.beforeSerialize)
        .sort((d1, d2) => (d2.priority || 0) - (d1.priority || 0))
        .map((d) => d.handler)
        .reduce<Descendant[]>((prev, curr) => curr(nodes), nodes);
      return nodesToText(nodes);
    },
    [plugins]
  );
}

/**
 * Converts the given string into a data structure.
 */
function useDeserialize(plugins: Plugin[]) {
  return useCallback(
    (
      text: string,
      multiline: boolean,
      options: { [key: string]: unknown }
    ): Descendant[] => {
      text = multiline ? text : text.replace(/\n|<br>/g, " ");
      let nodes: Descendant[] = textToNodes(text);
      nodes = normalizePlugins(plugins)
        .sort(
          (s1, s2) =>
            (s2.afterDeserialize.priority || 0) -
            (s1.afterDeserialize.priority || 0)
        )
        .reduce<Descendant[]>(
          (prev, curr) =>
            curr.afterDeserialize.handler(nodes, options[curr.name]),
          nodes
        );
      return addRoot(nodes);
    },
    [plugins]
  );
}

export { useSerialize, useDeserialize };
