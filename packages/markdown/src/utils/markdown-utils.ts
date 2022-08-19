import { unwrapElement, WithAlign } from "@react-fluent-edit/core";
import { marked } from "marked";
import { BaseRange, NodeEntry, Text } from "slate";

function hasAlign(element: any): element is Required<WithAlign> {
  const elem = unwrapElement<WithAlign>(element);
  return !!elem?.align;
}

interface WithTokens {
  tokens?: marked.Token[];
  items?: marked.Token[];
  raw: string;
}

interface WithPosition {
  _start: number;
  _end: number;
}

type CustomToken = marked.Token & WithPosition & WithTokens;

function addPositions(token: CustomToken) {
  const subs = token.tokens || token.items;
  if (subs) {
    const start = token._start || 0;
    let subpos = 0;
    subs.forEach((sub: CustomToken) => {
      const substart = token.raw.indexOf(sub.raw, subpos);
      const sublen = sub.raw.length;
      sub._start = substart + start;
      sub._end = sub._start + sublen;
      subpos = substart + sublen;
    });
  }
}

const markdownTypes = {
  strong: "strong",
  em: "emphasis",
  del: "delete",
  code: "inlineCode",
};

function decorateMarkdown(entry: NodeEntry): BaseRange[] {
  const [node, path] = entry;
  const ranges: BaseRange[] = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const tokens = marked.lexer(node.text);
  marked.walkTokens(tokens, addPositions);
  marked.walkTokens(tokens, (token: CustomToken) => {
    if (["strong", "em", "del", "code"].includes(token.type)) {
      ranges.push({
        [markdownTypes[token.type]]: true,
        anchor: { path, offset: token._start },
        focus: { path, offset: token._end },
      });
    }
    if (token.type === "heading") {
      // ranges.push({
      //   heading: true,
      //   depth: 1,
      //   anchor: { path, offset: token._start },
      //   focus: { path, offset: token._end },
      // });
    }
  });

  return ranges;
}

export { hasAlign, decorateMarkdown };
