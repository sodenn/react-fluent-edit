import {
  CustomText,
  Heading,
  isParagraph,
  unwrapElement,
  walkNodes,
} from "@react-fluent-edit/core";
import { BaseRange, Descendant, NodeEntry, Text } from "slate";
import { getTokens, Token, walkTokens } from "./tokenizer";

function isHeading(element: any): element is Heading {
  const elem = unwrapElement<Heading>(element);
  return elem?.type === "heading";
}

function decorateMarkdown(entry: NodeEntry): BaseRange[] {
  const [node, path] = entry;
  const ranges: (BaseRange & Omit<CustomText, "text">)[] = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const tokens = getTokens(node.text);
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

  return ranges;
}

function withMarkdownNodes(nodes: Descendant[]): Descendant[] {
  walkNodes(nodes, ([prev], [curr]) => {
    if (isParagraph(prev) && Text.isText(curr)) {
      const tokens = getTokens(curr.text);
      const firstToken = tokens.length > 0 && tokens[0];
      if (firstToken && firstToken.type === "heading") {
        Object.assign(prev, {
          type: "heading",
          depth: firstToken.depth,
          children: prev.children,
        });
      }
    }
  });
  return nodes;
}

function withoutMarkdownNodes(nodes: Descendant[]): Descendant[] {
  walkNodes(nodes, ([prev], [curr]) => {
    if (isHeading(curr)) {
      // @ts-ignore
      delete curr.depth;
      Object.assign(curr, {
        type: "paragraph",
      });
    }
  });
  return nodes;
}

export { decorateMarkdown, withMarkdownNodes, withoutMarkdownNodes, isHeading };
