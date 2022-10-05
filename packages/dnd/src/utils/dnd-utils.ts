import { cloneChildren, CustomText, DnD } from "@react-fluent-edit/core";
import { Descendant, Element, Node, NodeEntry, Text } from "slate";
import { DnDMatch, DnDMatchFn } from "../types";

function getDnD(text: string, match: DnDMatchFn): DnD {
  const items = match(text);
  if (items.length > 0) {
    const { raw, text } = items[0];
    return {
      type: "dnd",
      raw,
      value: text,
      children: [{ text: "" }],
    };
  }
  throw new Error(`No match found. Text: "${text}"`);
}

function defaultMatch(text: string) {
  const result: DnDMatch[] = [];

  for (const match of text.matchAll(/{{(.[^{}]+)}}/g)) {
    const [raw, text] = match;
    const start = match.index || 0;
    const end = start + raw.length;
    result.push({
      text,
      raw,
      start,
      end,
    });
  }

  return result;
}

function withDnDNodes(nodes: Descendant[], match: DnDMatchFn): Descendant[] {
  const root: Node = { type: "root", children: cloneChildren(nodes) };

  const textEntries = Array.from(Node.nodes(root)).filter(
    (e): e is NodeEntry<CustomText> => Text.isText(e[0])
  );

  for (const textEntry of textEntries) {
    const [textNode, textPath] = textEntry;
    const text = textNode.text;
    const items = match(text);

    let index = 0;
    const textNodesAndDnD: Descendant[] = [];
    for (const item of items) {
      const { text: value, raw, start, end } = item;

      const textBefore = text.substring(index, start);
      textNodesAndDnD.push({ text: textBefore });

      const dnd: DnD = {
        type: "dnd",
        value,
        raw,
        children: [{ text: "" }],
      };
      textNodesAndDnD.push(dnd);

      index = end;
    }

    textNodesAndDnD.push({
      text: text.substring(index),
    });

    const parent = Node.parent(root, textPath);
    const textNodeIndex = parent.children.indexOf(textNode as any);
    parent.children.splice(textNodeIndex, 1, ...textNodesAndDnD);
  }

  return root.children;
}

function removeDnDNodes(nodes: Descendant[]) {
  let index = nodes.length;
  while (index--) {
    const node = nodes[index];
    if (Element.isElement(node) && node.type === "dnd") {
      nodes[index] = { text: node.raw };
    } else if (Element.isElement(node) && node.children.length) {
      removeDnDNodes(node.children);
    }
  }
}

function withoutDnDNodes(nodes: Descendant[]) {
  removeDnDNodes(nodes);
  return nodes;
}

export { withDnDNodes, withoutDnDNodes, defaultMatch, getDnD };
