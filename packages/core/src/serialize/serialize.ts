import { useCallback } from "react";
import { Descendant } from "slate";
import { markdown2slate, slate2markdown } from "../markdown";
import usePlugins from "../usePlugins";
import { addRoot, cloneChildren, slate2text, text2slate } from "../utils";

/**
 * Converts the given data structure into a string.
 *
 * @param markdown If `true`, a markdown string is returned.
 */
function useSerialize(markdown: boolean) {
  const plugins = usePlugins();
  return useCallback(
    (nodes: Descendant[]): string => {
      nodes = cloneChildren(nodes);
      nodes = plugins
        .map((p) => p.beforeSerialize)
        .sort((d1, d2) => (d2.priority || 0) - (d1.priority || 0))
        .map((d) => d.handler)
        .reduce<Descendant[]>((prev, curr) => curr(nodes), nodes);
      return markdown ? slate2markdown(nodes) : slate2text(nodes);
    },
    [plugins]
  );
}

/**
 * Converts the given string into a data structure.
 *
 * @param markdown
 */
function useDeserialize(markdown: boolean) {
  const plugins = usePlugins();
  return useCallback(
    (
      text: string,
      singleLine: boolean,
      options: { [key: string]: unknown }
    ): Descendant[] => {
      text = singleLine ? text.replace("\n", " ") : text;
      let nodes: Descendant[] = markdown
        ? markdown2slate(text)
        : text2slate(text);
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
