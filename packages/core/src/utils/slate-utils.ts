import {
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Text,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { CustomElement, Paragraph, Root, WithChildren } from "../types";

function unwrapElement<T>(element: any): T | undefined {
  return Array.isArray(element) && element.length > 0 ? element[0] : element;
}

function isParagraph(element: any): element is Paragraph {
  const elem = unwrapElement<Paragraph>(element);
  return elem?.type === "paragraph";
}

function hasChildren(element: any): element is WithChildren {
  const elem = unwrapElement<WithChildren>(element);
  return !!elem?.children && elem?.children.length > 0;
}

function withoutTab(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (Text.isText(node) && /\t/.test(node.text)) {
      Transforms.insertText(editor, node.text.replace(/\t/, "  "), {
        at: path,
      });
    }
    normalizeNode([node, path]);
  };

  return editor;
}

function withSingleLine(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length > 1) {
        Transforms.mergeNodes(editor);
      }
    }
    normalizeNode([node, path]);
  };

  return editor;
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

function slate2text(nodes: Descendant[]): string {
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

function text2slate(text: string): Descendant[] {
  text = text.replace(/<br>/g, "\n");
  if (!/\n/.test(text)) {
    return [
      {
        type: "paragraph",
        children: [{ text }],
      },
    ];
  }
  return text.split(/\n/g).map((line) => ({
    type: "paragraph",
    children: [{ text: line }],
  }));
}

function focusEditor(editor: Editor) {
  ReactEditor.focus(editor);
  // Fallback: try to select the last node
  if (!editor.selection) {
    const path = Editor.end(editor, []);
    Transforms.select(editor, path);
  }
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

function walkNodes(
  nodes: Descendant[],
  fn: (prev: NodeEntry | [undefined, undefined], curr: NodeEntry) => void
) {
  const root: Root = { type: "root", children: nodes };
  let prev: NodeEntry | [undefined, undefined] = [undefined, undefined];
  return Array.from(Node.nodes(root))
    .filter(([n]) => !(Element.isElement(n) && n.type === "root"))
    .forEach((entry) => {
      fn(prev, entry);
      prev = entry;
    });
}

export {
  isParagraph,
  withoutTab,
  withSingleLine,
  addRoot,
  removeRoot,
  focusEditor,
  slate2text,
  text2slate,
  cloneChildren,
  hasChildren,
  unwrapElement,
  walkNodes,
};
