import {
  createEditor,
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

type WalkEntry = NodeEntry | [null, null];

interface WalkItem {
  prevEntry: WalkEntry;
  currEntry: NodeEntry;
  nextEntry: WalkEntry;
}

interface WalkOptions {
  nodes: Descendant[];
  match?: (node: NodeEntry) => boolean;
  callback: (item: WalkItem) => void;
}

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

function walkNodes(opt: WalkOptions) {
  const { nodes, match, callback } = opt;

  const root: Root = { type: "root", children: nodes };
  const allNodes = Array.from(Node.nodes(root)).filter(
    (entry) => !match || match(entry)
  );

  for (let idx = 0; idx < allNodes.length; idx++) {
    const prevEntry: WalkEntry = idx > 0 ? allNodes[idx - 1] : [null, null];
    const currEntry = allNodes[idx];
    const nextEntry: WalkEntry =
      idx + 1 < allNodes.length ? allNodes[idx + 1] : [null, null];
    callback({ prevEntry, currEntry, nextEntry });
  }
}

function removeNodes(nodes: Node[], nodesToRemove: Node[]) {
  let i = nodes.length;
  while (i--) {
    const node = nodes[i];
    if (nodesToRemove.includes(node)) {
      nodes.splice(i, 1);
    } else if (hasChildren(node)) {
      removeNodes(node.children, nodesToRemove);
    }
  }
}

function getNodeParent(nodes: Node[], node: Node) {
  for (let idx = 0; idx <= nodes.length; idx++) {
    const n = nodes[idx];
    if (n === node) {
      return { nodes, index: idx };
    } else if (hasChildren(n)) {
      getNodeParent(n.children, node);
    }
  }
}

const editor = createEditor();

function unwrapNodes(nodes: Descendant[], match: (node: Node) => boolean) {
  Editor.withoutNormalizing(editor, () => {
    editor.children = [{ type: "root", children: nodes }];
    Transforms.liftNodes(editor, {
      at: [0],
      mode: "all",
      match: (n: any) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "list",
    });
    Transforms.unwrapNodes(editor, {
      split: true,
      mode: "all",
      at: [0],
      match: (n: any) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "list",
    });
  });
  return editor.children;
}

function setNodes(
  nodes: Descendant[],
  props: Partial<Node>,
  match: (node: Node) => boolean
) {
  Editor.withoutNormalizing(editor, () => {
    editor.children = [{ type: "root", children: nodes }];
    Transforms.setNodes(editor, props, { match, at: [0] });
  });
  const root = editor.children[0] as Root;
  return root.children;
}

function unsetNodes(
  nodes: Descendant[],
  props: string | string[],
  match: (node: Node) => boolean
) {
  Editor.withoutNormalizing(editor, () => {
    editor.children = [{ type: "root", children: nodes }];
    Transforms.unsetNodes(editor, props, { match, at: [0] });
  });
  const root = editor.children[0] as Root;
  return root.children;
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
  setNodes,
  unsetNodes,
  removeNodes,
  getNodeParent,
  unwrapNodes,
};
