import {
  Descendant,
  Editor,
  Element,
  Node,
  Range,
  Text,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { CustomElement, Paragraph, Root, WithChildren } from "../types";

function isParagraph(element: any): element is Paragraph {
  return element?.type === "paragraph";
}

function hasChildren(element: any): element is WithChildren {
  return !!element?.children && element?.children.length > 0;
}

function addRoot(nodes: Descendant[]): Descendant[] {
  if (nodes.every((n) => !hasChildren(n))) {
    return [
      {
        type: "paragraph",
        children: nodes,
      },
    ];
  }
  return nodes;
}

function removeRoot(nodes: Descendant[]) {
  if (nodes.length === 1 && hasChildren(nodes[0])) {
    return nodes[0].children;
  } else {
    return nodes;
  }
}

function focusEditor(editor: Editor) {
  ReactEditor.focus(editor);
  // Fallback: try to select the last node
  if (!editor.selection) {
    const path = Editor.end(editor, []);
    Transforms.select(editor, path);
  }
}

function setAutofocusCursorPosition(
  editor: Editor,
  position?: "start" | "end"
) {
  const selection = editor.selection;
  if (!position || !selection || !Range.isCollapsed(selection)) {
    return;
  }
  const location =
    position === "start" ? Editor.start(editor, []) : Editor.end(editor, []);
  // Note: Transforms.select(editor, location) only works with a small delay in this case.
  // So use an interval as a workaround (1-50 ms).
  let count = 0;
  const interval = setInterval(() => {
    const domSelection = window.getSelection();
    if (domSelection?.anchorOffset === location.offset || count === 50) {
      clearInterval(interval);
    }
    Transforms.select(editor, location);
    count++;
  }, 1);
}

function nodesToText(nodes: Descendant[]): string {
  const root: Root = { type: "root", children: nodes };
  let text = Array.from(Node.nodes(root)).reduce((prev, [node]) => {
    if (isParagraph(node)) {
      return prev + "\n";
    } else if (Text.isText(node)) {
      return prev + node.text;
    }
    return prev;
  }, "");
  text = text.replace(/^[\r\n]+/, "");
  return text;
}

function cloneChildren(children: Descendant[]): Descendant[] {
  return children.map((node) => {
    if (Element.isElement(node)) {
      return {
        ...node,
        children: cloneChildren(node.children as Descendant[]),
      } as CustomElement;
    }
    return { ...node };
  });
}

export {
  isParagraph,
  addRoot,
  removeRoot,
  focusEditor,
  setAutofocusCursorPosition,
  cloneChildren,
  hasChildren,
  nodesToText,
};
