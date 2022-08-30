import {
  cloneChildren,
  CustomText,
  Heading,
  isParagraph,
  Paragraph,
  Root,
  setNodes,
  unsetNodes,
  unwrapElement,
} from "@react-fluent-edit/core";
import {
  BaseRange,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Text,
} from "slate";
import { getTokens, rules, Token, walkTokens } from "./tokenizer";

function isHeading(element: any): element is Heading {
  const elem = unwrapElement<Heading>(element);
  return elem?.type === "heading";
}

function decorateMarkdown(entry: NodeEntry, editor: Editor): BaseRange[] {
  const [node, path] = entry;
  const ranges: (BaseRange & Omit<CustomText, "text">)[] = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const text = Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "paragraph",
    })
  ).reduce((prev, curr, index) => {
    const line = Editor.string(editor, [index]);
    prev += index === 0 ? line : `\n${line}`;
    return prev;
  }, "");

  const tokens = getTokens(text);
  walkTokens(tokens, (token: Token) => {
    let markers: { prefix?: number; suffix?: number } | undefined = undefined;
    if (
      token.type === "strong" ||
      token.type === "em" ||
      token.type === "del" ||
      token.type === "codespan"
    ) {
      ranges.push({
        [token.type]: true,
        anchor: { path, offset: token._start },
        focus: { path, offset: token._end },
      });
      const [prefix, suffix] = token.raw.split(token.text);
      markers = { prefix: prefix.length, suffix: suffix.length };
    } else if (token.type === "link") {
      const [prefix, suffix] = token.raw.split(token.text);
      markers = { prefix: prefix.length, suffix: suffix.length };
    } else if (token.type === "heading") {
      markers = { prefix: token.depth };
    }
    if (markers) {
      const { prefix, suffix } = markers;
      if (prefix) {
        ranges.push({
          marker: true,
          anchor: { path, offset: token._start },
          focus: { path, offset: token._start + prefix },
        });
      }
      if (suffix) {
        ranges.push({
          marker: true,
          anchor: { path, offset: token._end - suffix },
          focus: { path, offset: token._end },
        });
      }
    }
  });

  const listMatch = node.text.match(rules.list);
  if (listMatch) {
    const [prefix] = listMatch;
    ranges.push({
      marker: true,
      anchor: { path, offset: 0 },
      focus: { path, offset: prefix.length - 1 },
    });
  }

  return ranges;
}

function withMarkdownNodes(nodes: Descendant[]): Descendant[] {
  let text = "";
  const root: Root = { type: "root", children: cloneChildren(nodes) };
  const paragraphs = Array.from(Node.nodes(root))
    .filter(([n]) => Element.isElement(n) && n.type !== "root")
    .filter((entry): entry is NodeEntry<Paragraph> => isParagraph(entry));

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const [node] = paragraphs[idx];

    const str = Node.string(node);
    text = text ? `${text}\n${str}` : str;
    const [token] = getTokens(text);

    if (isHeading(token)) {
      Object.assign(node, {
        type: "heading",
        depth: token.depth,
        children: node.children,
      });
    }
  }

  return paragraphs.map(([p]) => p);
}

function withoutMarkdownNodes(nodes: Descendant[]): Descendant[] {
  unsetNodes(nodes, ["depth"], (n) => isHeading(n));
  setNodes(nodes, { type: "paragraph" }, (n) => isHeading(n));
  return nodes;
}

export { decorateMarkdown, withMarkdownNodes, withoutMarkdownNodes, isHeading };
