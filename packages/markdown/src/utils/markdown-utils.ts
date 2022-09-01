import { CustomText } from "@react-fluent-edit/core";
import { KeyboardEvent } from "react";
import { BaseRange, Editor, NodeEntry, Range, Text } from "slate";
import { getTokens, HeadingToken, rules, Token, walkTokens } from "./tokenizer";

function getHeadingType(token: HeadingToken) {
  switch (token.depth) {
    case 1:
      return "h1";
    case 2:
      return "h2";
    case 3:
      return "h3";
    case 4:
      return "h4";
    case 5:
      return "h5";
    case 6:
      return "h6";
  }
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
      const type = getHeadingType(token);
      if (type) {
        ranges.push({
          [type]: true,
          anchor: { path, offset: token._start },
          focus: { path, offset: token._end },
        });
        markers = { prefix: token.depth };
      }
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

function moveListItem(ev: KeyboardEvent<HTMLDivElement>, editor: Editor) {
  const { selection } = editor;
  if (ev.key === "Tab" && selection && Range.isCollapsed(selection)) {
    const [start] = Range.edges(selection);
    const beforeLine = Editor.before(editor, start, { unit: "line" });
    const beforeLineRange =
      beforeLine && Editor.range(editor, beforeLine, start);
    const beforeText =
      beforeLineRange && Editor.string(editor, beforeLineRange);
    const listMatch = beforeText && beforeText.match(rules.listItem);
    const moveListItem = listMatch && listMatch[0] === beforeText;
    if (moveListItem && ev.shiftKey) {
      console.log("backward");
      ev.preventDefault();
      return true;
    } else if (moveListItem) {
      console.log("forward");
      ev.preventDefault();
      return true;
    }
  }
  return false;
}

export { decorateMarkdown, moveListItem };
