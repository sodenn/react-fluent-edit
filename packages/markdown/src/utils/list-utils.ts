import { CustomText } from "@react-fluent-edit/core";
import { KeyboardEvent } from "react";
import { Editor, Location, NodeEntry, Range, Text, Transforms } from "slate";
import { rules } from "./tokenizer";

type Direction = "forward" | "backward";

function moveListItem(ev: KeyboardEvent<HTMLDivElement>, editor: Editor) {
  let handled: Location | undefined = undefined;
  const { selection } = editor;
  if (ev.key === "Tab" && selection && Range.isCollapsed(selection)) {
    const [start] = Range.edges(selection);
    const backward = ev.shiftKey;
    if (backward) {
      handled = moveCurrentListItem(editor, start, "backward");
    } else {
      handled = moveCurrentListItem(editor, start, "forward");
    }
    if (handled) {
      renumberFollowingListItems(editor, start);
      Transforms.select(editor, handled);
    }
  }
  if (handled) {
    ev.preventDefault();
  }
  return handled;
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

function getPreviousListItem(editor: Editor, location: Location) {
  const [, parentPath] = Editor.parent(editor, location, { edge: "start" });
  const prev = Editor.previous(editor, {
    at: parentPath,
  });
  const textEntry = prev && getTextNode(editor, prev);
  return textEntry && isListItem(textEntry[0]) ? textEntry : undefined;
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

function getListSymbol(str: string) {
  const listMatch = str.match(rules.listItem);
  if (!listMatch) {
    return;
  }

  const text = listMatch[1];
  let [symbol] = listMatch[0].split(text);

  symbol = symbol.trim().replace(".", "");
  const num = parseInt(symbol);

  if (isNaN(num)) {
    return symbol;
  }

  const depthMatch = str.match(/^ +/);
  if (!depthMatch) {
    return {
      depth: 0,
      num,
    };
  } else {
    const depth = Math.ceil(depthMatch[0].length / 3);
    return {
      depth,
      num,
    };
  }
}

function getNewListSymbol(
  editor: Editor,
  location: Location,
  direction: Direction
) {
  const curr = getCurrentListItem(editor, location);
  const currSymbol = curr && getListSymbol(curr[0].text);

  const prev = getPreviousListItem(editor, location);
  const prevSymbol = prev && getListSymbol(prev[0].text);

  if (
    typeof prevSymbol === "object" &&
    typeof currSymbol === "object" &&
    ((direction === "forward" && prevSymbol.depth === currSymbol.depth + 1) ||
      (direction === "backward" && prevSymbol.depth === currSymbol.depth - 1))
  ) {
    return prevSymbol.num + 1;
  } else if (
    typeof currSymbol === "object" &&
    (direction === "forward" || currSymbol.depth > 0)
  ) {
    return 1;
  } else if (typeof currSymbol === "string") {
    return currSymbol;
  }
}

function getNextListSymbol(editor: Editor, location: Location) {
  const curr = getCurrentListItem(editor, location);
  const currSymbol = curr && getListSymbol(curr[0].text);

  const next = getNextListItem(editor, location);
  const nextSymbol = next && getListSymbol(next[0].text);

  if (typeof nextSymbol === "object" && typeof currSymbol === "object") {
    if (nextSymbol.depth === currSymbol.depth - 1) {
      return nextSymbol.num - 1;
    } else if (nextSymbol.depth === currSymbol.depth) {
      return currSymbol.num + 1;
    } else if (nextSymbol.depth === currSymbol.depth + 1) {
      return currSymbol.num - 1;
    }
  } else if (typeof nextSymbol === "string") {
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

export { moveListItem };
