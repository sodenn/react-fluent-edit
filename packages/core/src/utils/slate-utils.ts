import { Descendant, Editor, Element, Node, Text, Transforms } from "slate";
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

function editorToDomNode(editor?: Editor) {
  try {
    return editor ? ReactEditor.toDOMNode(editor, editor) : undefined;
  } catch (e) {
    return;
  }
}

export {
  isParagraph,
  addRoot,
  removeRoot,
  focusEditor,
  cloneChildren,
  hasChildren,
  nodesToText,
  editorToDomNode,
};
