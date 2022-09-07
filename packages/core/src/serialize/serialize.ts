import { useCallback } from "react";
import { Descendant } from "slate";
import usePlugins from "../usePlugins";
import { addRoot, cloneChildren, nodesToText } from "../utils";

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
function useSerialize() {
  const plugins = usePlugins();
  return useCallback(
    (nodes: Descendant[]): string => {
      nodes = cloneChildren(nodes);
      nodes = plugins
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
function useDeserialize() {
  const plugins = usePlugins();
  return useCallback(
    (
      text: string,
      singleLine: boolean,
      options: { [key: string]: unknown }
    ): Descendant[] => {
      text = singleLine ? text.replace(/\n|<br>/g, " ") : text;
      let nodes: Descendant[] = textToNodes(text);
      nodes = plugins
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
