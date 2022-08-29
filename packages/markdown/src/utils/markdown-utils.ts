import {
  cloneChildren,
  CustomText,
  hasChildren,
  Heading,
  isParagraph,
  List,
  ListItem,
  Paragraph,
  Root,
  setNodes,
  unsetNodes,
  unwrapElement,
  unwrapNodes,
} from "@react-fluent-edit/core";
import { BaseRange, Descendant, Element, Node, NodeEntry, Text } from "slate";
import {
  getTokens,
  isListToken,
  ListItemToken,
  Token,
  walkTokens,
} from "./tokenizer";

function isHeading(element: any): element is Heading {
  const elem = unwrapElement<Heading>(element);
  return elem?.type === "heading";
}

function isList(element: any): element is List {
  const elem = unwrapElement<List>(element);
  return elem?.type === "list";
}

function isListItem(element: any): element is ListItem {
  const elem = unwrapElement<ListItem>(element);
  return elem?.type === "list_item";
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
  let text = "";
  const paragraphsToBeDeleted: number[] = [];
  const root: Root = { type: "root", children: cloneChildren(nodes) };
  const paragraphs = Array.from(Node.nodes(root))
    .filter(([n]) => Element.isElement(n) && n.type !== "root")
    .filter((entry): entry is NodeEntry<Paragraph> => isParagraph(entry));

  for (let idx = 0; idx < paragraphs.length; idx++) {
    const [node] = paragraphs[idx];
    const [nextNode] =
      idx + 1 < paragraphs.length ? paragraphs[idx + 1] : [undefined];

    const str = Node.string(node);
    text = text ? `${text}\n${str}` : str;
    const [token] = getTokens(text);

    const nextStr = nextNode ? Node.string(nextNode) : undefined;
    const nextText = nextStr ? `${text}\n${nextStr}` : undefined;
    const [nextToken] = nextText ? getTokens(nextText) : [undefined];

    if (isHeading(token)) {
      Object.assign(node, {
        type: "heading",
        depth: token.depth,
        children: node.children,
      });
      continue;
    }

    if (
      isListToken(token) &&
      (JSON.stringify(token) === JSON.stringify(nextToken) || !nextToken)
    ) {
      const list: List = {
        type: "list",
        start: token.start,
        ordered: token.ordered,
        loose: token.loose,
        children: [],
      };

      const { value: lines } = setListContent(list, token.items);
      const replaceIndex = idx - lines + 1;
      const startDelete = replaceIndex + 1;
      const deleteCount = lines - 1;
      for (let i = 0; i < deleteCount; i++) {
        paragraphsToBeDeleted.push(startDelete + i);
      }

      const paragraphToReplace = paragraphs[replaceIndex];
      Object.assign(paragraphToReplace[0], list);
      break;
    }
  }

  paragraphsToBeDeleted.reverse().forEach((i) => {
    paragraphs.splice(i, 1);
  });

  return paragraphs.map(([p]) => p);
}

function setListContent(
  list: List,
  items: ListItemToken[],
  lines = { value: 0 }
) {
  items.forEach((item) => {
    const { raw, text, _start, _end, tokens, ...rest } = item;

    const listItem: ListItem = {
      ...rest,
      children: [],
    };

    tokens.forEach((token) => {
      if (isListToken(token)) {
        const { items, _start, _end, raw, ...rest } = token;
        const subList: List = { ...rest, children: [] };
        setListContent(subList, items, lines);
        listItem.children = [...listItem.children, subList];
      } else if (token.type === "text") {
        listItem.children = [...listItem.children, { text: token.text }];
      }
    });

    lines.value++;
    list.children.push(listItem);
  });
  return lines;
}

function withoutMarkdownNodes(nodes: Descendant[]): Descendant[] {
  let newNodes = cloneChildren(nodes);
  unsetNodes(newNodes, ["depth"], (n) => isHeading(n));
  setNodes(newNodes, { type: "paragraph" }, (n) => isHeading(n));
  list2Text(newNodes);
  newNodes = unwrapNodes(newNodes, (node) => isList(node));
  unsetNodes(newNodes, ["task", "checked", "loose"], (n) => isListItem(n));
  setNodes(newNodes, { type: "paragraph" }, (n) => isListItem(n));
  return newNodes;
}

type NodeWithParent = Descendant & { _parent?: Descendant };

function list2Text(nodes: NodeWithParent[], parent?: NodeWithParent) {
  for (const node of nodes) {
    node._parent = parent;
    if (isListItem(node)) {
      const depth = getDepth(node);
      const whitespaces = getWhitespaces(depth);
      const position = getPosition(node);
      node.children.forEach((child) => {
        if (Text.isText(child)) {
          if (position) {
            child.text = `${position}. ${child.text}`;
          } else {
            child.text = `- ${child.text}`;
          }
          child.text = whitespaces + child.text;
        }
      });
    }
    if (hasChildren(node)) {
      list2Text(node.children, node);
    }
  }
}

function getPosition(node: NodeWithParent) {
  const parent = node._parent;
  if (isList(parent) && parent.ordered) {
    return parent.children.indexOf(node as any) + 1;
  } else {
    return 0;
  }
}

function getDepth(node: NodeWithParent, depth = { value: -1 }) {
  if (isList(node._parent) || isListItem(node._parent)) {
    depth.value++;
    getDepth(node._parent, depth);
  }
  return depth.value;
}

function getWhitespaces(depth: number) {
  return depth ? " ".repeat(depth * 2) : "";
}

export { decorateMarkdown, withMarkdownNodes, withoutMarkdownNodes, isHeading };
