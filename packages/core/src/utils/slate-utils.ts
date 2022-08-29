import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Node,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { CustomElement, Paragraph, WithChildren } from "../types";

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

const editor = createEditor();
function unwrapNodes(nodes: Descendant[], match: (node: Node) => boolean) {
  Editor.withoutNormalizing(editor, () => {
    editor.children = [{ type: "root", children: nodes }];
    Transforms.liftNodes(editor, {
      at: [0],
      mode: "all",
      match: match,
    });
    Transforms.unwrapNodes(editor, {
      split: true,
      mode: "all",
      at: [0],
      match: match,
    });
  });
  return cloneChildren(editor.children);
}

function setNodes(
  nodes: Descendant[],
  props: Partial<Node>,
  match: (node: Node) => boolean
) {
  nodes.forEach((node) => {
    if (match(node)) {
      Object.assign(node, props);
    } else if (hasChildren(node)) {
      setNodes(node.children, props, match);
    }
  });
}

function unsetNodes(
  nodes: Descendant[],
  props: string[],
  match: (node: Node) => boolean
) {
  nodes.forEach((node) => {
    if (match(node)) {
      props.forEach((prop) => {
        delete node[prop];
      });
    } else if (hasChildren(node)) {
      unsetNodes(node.children, props, match);
    }
  });
}

export {
  isParagraph,
  addRoot,
  removeRoot,
  focusEditor,
  cloneChildren,
  hasChildren,
  unwrapElement,
  removeNodes,
  unwrapNodes,
  setNodes,
  unsetNodes,
};
