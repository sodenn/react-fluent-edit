import {
  CustomText,
  getNodeParent,
  Heading,
  isParagraph,
  List,
  ListItem,
  setNodes,
  unsetNodes,
  unwrapElement,
  unwrapNodes,
  walkNodes,
} from "@react-fluent-edit/core";
import { removeNodes } from "@react-fluent-edit/core/src";
import { BaseRange, Descendant, Node, NodeEntry, Text } from "slate";
import {
  getTokens,
  ListItemToken,
  ListToken,
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
  let listText = "";
  let listNodes: Node[] = [];
  const tokenList: { listNodes: Node[]; listToken: ListToken }[] = [];
  let nextFirstToken: Token | undefined = undefined;

  walkNodes({
    nodes,
    match: (entry) => isParagraph(entry),
    callback: ({ currEntry, nextEntry: [next] }) => {
      const [curr] = currEntry;
      if (!isParagraph(curr)) {
        return;
      }

      const textNode = Node.child(curr, 0);
      if (!textNode || !Text.isText(textNode)) {
        return;
      }
      const src = listText ? listText + "\n" + textNode.text : textNode.text;
      const tokens = getTokens(src);

      const firstToken = tokens.length > 0 ? tokens[0] : undefined;
      if (!firstToken) {
        return;
      }

      if (firstToken.type === "heading") {
        Object.assign(curr, {
          type: "heading",
          depth: firstToken.depth,
          children: curr.children,
        });
        return;
      }

      const nextTextNode = next && Node.child(next, 0);
      const nextSrc = Text.isText(nextTextNode)
        ? src + "\n" + nextTextNode.text
        : undefined;
      const nextTokens = nextSrc ? getTokens(nextSrc) : undefined;
      if (nextTokens && nextTokens.length > 0) {
        nextFirstToken = nextTokens[0];
      }

      if (
        firstToken.type === "list" &&
        JSON.stringify(firstToken) === JSON.stringify(nextFirstToken)
      ) {
        listNodes.push(currEntry[0]);
        tokenList.push({ listNodes, listToken: firstToken });
        listText = "";
        listNodes = [];
        nextFirstToken = undefined;
      } else if (firstToken.type === "list") {
        listText = listText
          ? listText + "\n" + textNode.text
          : listText + textNode.text;
        listNodes.push(currEntry[0]);
      }
    },
  });

  for (const { listNodes, listToken } of tokenList) {
    const nodeToReplace = listNodes[0];
    if (!nodeToReplace) {
      continue;
    }

    const parent = getNodeParent(nodes, nodeToReplace);
    if (!parent) {
      continue;
    }

    const list: List = {
      type: "list",
      start: listToken.start,
      ordered: listToken.ordered,
      loose: listToken.loose,
      children: [],
    };

    setListContent(list, listToken.items as ListItemToken[]);

    parent.nodes.splice(parent.index, 0, list);

    removeNodes(nodes, listNodes);
  }

  return nodes;
}

function setListContent(list: List, items: ListItemToken[]) {
  items.forEach((item) => {
    const { raw, text, _start, _end, tokens, ...rest } = item;

    const listItem: ListItem = {
      ...rest,
      children: [],
    };

    tokens.forEach((token) => {
      if (token.type === "list") {
        const { items, _start, _end, raw, ...rest } = token as ListToken;
        const subList: List = { ...rest, children: [] };
        setListContent(subList, items as ListItemToken[]);
        listItem.children = [...listItem.children, subList];
      } else if (token.type === "text") {
        listItem.children = [...listItem.children, { text: token.text }];
      }
    });

    list.children.push(listItem);
  });
}

function withoutMarkdownNodes(nodes: Descendant[]): Descendant[] {
  nodes = unsetNodes(nodes, "depth", (n) => isHeading(n));
  nodes = setNodes(nodes, { type: "paragraph" }, (n) => isHeading(n));
  nodes = unwrapNodes(nodes, (node) => isList(node));
  nodes = unsetNodes(nodes, ["task", "checked", "loose"], (n) => isListItem(n));
  nodes = setNodes(nodes, { type: "paragraph" }, (n) => isListItem(n));
  return nodes;
}

export { decorateMarkdown, withMarkdownNodes, withoutMarkdownNodes, isHeading };
