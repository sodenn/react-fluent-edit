import { CustomText, DecoratorProps } from "@react-fluent-edit/core";
import { BaseRange, NodeEntry, Text } from "slate";
import { MarkdownPluginOptions } from "../types";
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

function decorateMarkdown({
  entry,
  options: { disabled = {} },
}: DecoratorProps<MarkdownPluginOptions>): BaseRange[] {
  const [node] = entry;
  const ranges: (BaseRange & Omit<CustomText, "text">)[] = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const tokens = getTokens(node.text);
  walkTokens(tokens, (token: Token) => {
    if (disabled[token.type]) {
      return;
    }
    const entryRanges = getRangeByToken(entry, token);
    if (entryRanges) {
      ranges.push(entryRanges);
    }
    const markerRanges = getMarkerRangeByToken(entry, token);
    if (markerRanges) {
      ranges.push(...markerRanges);
    }
  });

  return ranges;
}

function getRangeByToken(entry: NodeEntry, token: Token) {
  const [, path] = entry;
  switch (token.type) {
    case "strong":
    case "em":
    case "del":
    case "codespan":
      return {
        [token.type]: true,
        anchor: { path, offset: token._start },
        focus: { path, offset: token._end },
      };
    case "heading": {
      const type = getHeadingType(token);
      if (type) {
        return {
          [type]: true,
          anchor: { path, offset: token._start },
          focus: { path, offset: token._end },
        };
      }
    }
  }
}

function getMarkerRangeByToken(entry: NodeEntry, token: Token) {
  const [, path] = entry;
  switch (token.type) {
    case "strong":
    case "em":
    case "del":
    case "codespan": {
      const [prefix, suffix] = token.raw.split(token.text);
      if (prefix && suffix) {
        return [
          {
            marker: true,
            anchor: { path, offset: token._start },
            focus: { path, offset: token._start + prefix.length },
          },
          {
            marker: true,
            anchor: { path, offset: token._end - suffix.length },
            focus: { path, offset: token._end },
          },
        ];
      }
      if (prefix) {
        return [
          {
            marker: true,
            anchor: { path, offset: token._start },
            focus: { path, offset: token._start + prefix.length },
          },
        ];
      }
      if (suffix) {
        return [
          {
            marker: true,
            anchor: { path, offset: token._end - suffix.length },
            focus: { path, offset: token._end },
          },
        ];
      }
      break;
    }
    case "link": {
      return [
        {
          marker: true,
          anchor: { path, offset: token._start },
          focus: { path, offset: token._start + 1 },
        },
        {
          marker: true,
          anchor: { path, offset: token._end - token.href.length + 3 },
          focus: { path, offset: token._end },
        },
      ];
    }
    case "list_item": {
      const match = token.raw.match(rules.listItemStart);
      if (match) {
        return [
          {
            marker: true,
            anchor: { path, offset: token._start },
            focus: { path, offset: token._start + match[0].length },
          },
        ];
      }
      break;
    }
    case "heading": {
      const type = getHeadingType(token);
      if (type) {
        return [
          {
            marker: true,
            anchor: { path, offset: token._start },
            focus: { path, offset: token._start + token.depth },
          },
        ];
      }
    }
  }
}

export { decorateMarkdown };
