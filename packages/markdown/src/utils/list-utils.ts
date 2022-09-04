import { CustomText } from "@react-fluent-edit/core";
import { Editor, Location, NodeEntry, Text, Transforms } from "slate";
import { rules } from "./tokenizer";

type Direction = "forward" | "backward";

function moveListItem(editor: Editor, location: Location, shiftKey = false) {
  let listItemLocation: Location | undefined;
  if (shiftKey) {
    listItemLocation = moveCurrentListItem(editor, location, "backward");
  } else {
    listItemLocation = moveCurrentListItem(editor, location, "forward");
  }
  if (listItemLocation) {
    renumberFollowingListItems(editor, location);
    Transforms.select(editor, listItemLocation);
  }
  return !!listItemLocation;
}

function addListSymbolToNewLine(editor: Editor, location: Location) {
  const entry = Editor.node(editor, location);

  if (!entry || !Text.isText(entry[0])) {
    return false;
  }

  const [textNode, textPath] = entry;
  const listMatch = textNode.text.match(rules.listItemStart);

  if (!listMatch) {
    return false;
  }

  const matchStr = listMatch[0];

  if (matchStr === textNode.text) {
    Transforms.insertText(editor, "", { at: textPath });
    return true;
  }

  const symbol = matchStr.trim().replace(".", "");
  const whitespacesMatch = matchStr.match(/^ */);
  const whitespaces = whitespacesMatch ? whitespacesMatch[0] : "";
  const num = parseInt(symbol);
  const nextSymbol = isNaN(num)
    ? whitespaces + symbol + " "
    : whitespaces + (num + 1) + ". ";
  Transforms.insertNodes(editor, {
    type: "paragraph",
    children: [{ text: nextSymbol }],
  });

  const selection = editor.selection;
  if (selection) {
    renumberFollowingListItems(editor, selection);
    Transforms.select(editor, selection);
  }

  return true;
}

function renumberFollowingListItems(editor: Editor, location: Location) {
  const nextSymbol = getNextListSymbol(editor, location);
  if (nextSymbol) {
    const next = getNextListItem(editor, location);
    if (next) {
      const [node, path] = next;
      const whitespacesMatch = node.text.match(/^ */);
      const whitespaces = whitespacesMatch ? whitespacesMatch[0] : "";
      const text = getTextWithoutSymbol(node.text);
      if (text) {
        const newText =
          typeof nextSymbol === "number"
            ? `${whitespaces}${nextSymbol}. ${text}`
            : `${whitespaces}${nextSymbol} ${text}`;
        Transforms.insertText(editor, newText, {
          at: path,
        });
      }
      renumberFollowingListItems(editor, path);
    }
  }
}

function moveCurrentListItem(
  editor: Editor,
  location: Location,
  direction: Direction
): Location | undefined {
  const curr = getCurrentListItem(editor, location);
  if (!curr) {
    return;
  }
  const [node, path] = curr;
  const newSymbol = getNewListSymbol(editor, location, direction);
  if (typeof newSymbol === "undefined") {
    return;
  }
  const whitespaces = getNewWhitespaces(curr, direction);
  const currText = getTextWithoutSymbol(node.text);
  if (currText) {
    const newText =
      typeof newSymbol === "number"
        ? `${whitespaces}${newSymbol}. ${currText}`
        : `${whitespaces}${newSymbol} ${currText}`;
    Transforms.insertText(editor, newText, {
      at: path,
    });
    return {
      anchor: { path, offset: newText.length },
      focus: { path, offset: newText.length },
    };
  }
}

function getCurrentListItem(editor: Editor, location: Location) {
  const curr = Editor.node(editor, location);
  if (Text.isText(curr[0])) {
    return curr as NodeEntry<CustomText>;
  }
}

function getPreviousListItem(
  editor: Editor,
  location: Location,
  depth?: number
): NodeEntry<CustomText> | undefined {
  const [, parentPath] = Editor.parent(editor, location, { edge: "start" });
  const prev = Editor.previous(editor, {
    at: parentPath,
  });
  const textEntry = prev && getTextNode(editor, prev);
  const listItem =
    textEntry && isListItem(textEntry[0]) ? textEntry : undefined;
  const listItemDepth = listItem && getDepth(listItem[0].text);

  if (listItem && typeof depth !== "undefined" && depth !== listItemDepth) {
    return getPreviousListItem(editor, listItem[1], depth);
  }

  return listItem;
}

function getNextListItem(editor: Editor, location: Location) {
  const [, parentPath] = Editor.parent(editor, location, { edge: "start" });
  const next = Editor.next(editor, {
    at: parentPath,
  });
  const textEntry = next && getTextNode(editor, next);
  return textEntry && isListItem(textEntry[0]) ? textEntry : undefined;
}

function getTextNode(editor: Editor, entry: NodeEntry) {
  const firstChild = getFirstChild(editor, entry);
  if (firstChild && Text.isText(firstChild[0])) {
    return firstChild as NodeEntry<CustomText>;
  }
}

function isListItem(textNode?: CustomText) {
  const listMatch = textNode && textNode.text.match(rules.listItem);
  return listMatch && listMatch[0] === textNode.text;
}

function getFirstChild(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;
  const children = Array.from(
    Editor.nodes(editor, {
      at: path,
      match: (n) => !Editor.isEditor(n) && n !== node,
    })
  );
  if (children.length > 0) {
    return children[0];
  }
}

function getTextWithoutSymbol(str: string) {
  const listMatch = str.match(rules.listItem);
  if (!listMatch) {
    return;
  }
  return listMatch[1].trimStart();
}

function getDepth(str: string) {
  const depthMatch = str.match(/^ +/);
  if (depthMatch) {
    return Math.ceil(depthMatch[0].length / 3);
  } else {
    return 0;
  }
}

function getListSymbol(str: string) {
  let listMatch = str.match(rules.listItem);
  if (!listMatch) {
    const listStartMatch = str.match(rules.listItemStart);
    if (listStartMatch) {
      listMatch = [listStartMatch[0], ""];
    } else {
      return false;
    }
  }

  const text = listMatch[1];
  let symbol = listMatch[0].substring(0, listMatch[0].lastIndexOf(text));

  symbol = symbol.trim().replace(".", "");
  const num = parseInt(symbol);

  if (isNaN(num)) {
    return symbol;
  }

  const depth = getDepth(str);
  return {
    depth,
    num,
  };
}

function getNewListSymbol(
  editor: Editor,
  location: Location,
  direction: Direction
) {
  const curr = getCurrentListItem(editor, location);
  const currSymbol = curr && getListSymbol(curr[0].text);
  const newDepth =
    typeof currSymbol === "object"
      ? direction === "forward"
        ? currSymbol.depth + 1
        : currSymbol.depth - 1
      : undefined;

  const prev = getPreviousListItem(editor, location, newDepth);
  const prevSymbol = prev && getListSymbol(prev[0].text);

  if (
    typeof prevSymbol === "object" &&
    typeof currSymbol === "object" &&
    prevSymbol.depth === newDepth
  ) {
    return prevSymbol.num + 1;
  }

  if (
    typeof currSymbol === "object" &&
    (direction === "forward" || currSymbol.depth > 0)
  ) {
    return 1;
  }

  if (typeof currSymbol === "string") {
    return currSymbol;
  }
}

function getNextListSymbol(editor: Editor, location: Location) {
  const curr = getCurrentListItem(editor, location);
  const currSymbol = curr && getListSymbol(curr[0].text);

  const next = getNextListItem(editor, location);
  const nextSymbol = next && getListSymbol(next[0].text);

  const prev =
    next &&
    typeof nextSymbol === "object" &&
    getPreviousListItem(editor, next[1], nextSymbol.depth);
  const prevSymbol = prev && getListSymbol(prev[0].text);

  if (
    typeof nextSymbol === "object" &&
    typeof currSymbol === "object" &&
    currSymbol.depth < nextSymbol.depth
  ) {
    return 1;
  }

  if (
    typeof nextSymbol === "object" &&
    typeof prevSymbol === "object" &&
    nextSymbol.depth === prevSymbol.depth
  ) {
    return prevSymbol.num + 1;
  }

  if (
    typeof nextSymbol === "object" &&
    typeof currSymbol === "object" &&
    nextSymbol.depth === currSymbol.depth
  ) {
    return currSymbol.num + 1;
  }

  if (typeof nextSymbol === "string") {
    return nextSymbol;
  }
}

function getNewWhitespaces(
  node: NodeEntry<CustomText> | undefined,
  direction: Direction
) {
  if (!node) {
    return "";
  }

  const [textNode] = node;
  const match = textNode.text.match(/^ */);
  if (!match) {
    return "";
  }

  const whitespaces = match[0];

  if (whitespaces.length >= 3 && direction === "backward") {
    return whitespaces.substring(3);
  }

  if (direction === "forward") {
    return " ".repeat(3) + whitespaces;
  }

  return "";
}

export { moveListItem, addListSymbolToNewLine };
