import { CustomElement } from "@react-fluent-edit/core";
import { KeyboardEvent, useCallback, useState } from "react";
import { Editor, Element, Node, Path, Text, Transforms } from "slate";
import {
  ActiveBlocks,
  ActiveMarks,
  AlignFormat,
  BlockFormat,
  Format,
  HeadingFormat,
  ListFormat,
  MarkFormat,
  RichTextHookReturnValue,
} from "../types";
import {
  getSelectionNode,
  hasAlign,
  isHeading,
  isList,
  isListItem,
} from "../utils";

const HEADING_TYPES: BlockFormat[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

const LIST_TYPES = ["ordered-list", "unordered-list"];

const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

function isListFormat(format: BlockFormat): format is ListFormat {
  return LIST_TYPES.includes(format);
}

function isHeadingFormat(format: BlockFormat): format is HeadingFormat {
  return HEADING_TYPES.includes(format);
}

function isAlignFormat(format: any): format is AlignFormat {
  return TEXT_ALIGN_TYPES.includes(format);
}

function getHeadingDepth(format: HeadingFormat) {
  switch (format) {
    case "h1":
      return 1;
    case "h2":
      return 2;
    case "h3":
      return 3;
    case "h4":
      return 4;
    case "h5":
      return 5;
    case "h6":
      return 6;
    default:
      return undefined;
  }
}

function getListOrder(format: ListFormat) {
  switch (format) {
    case "ordered-list":
      return true;
    case "unordered-list":
      return false;
  }
}

function format2ElementType(format: BlockFormat) {
  switch (format) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return "heading";
    case "ordered-list":
    case "unordered-list":
      return "list";
    case "block-quote":
      return "blockquote";
  }
}

function hasElementFormat(element: CustomElement, format: BlockFormat) {
  if (hasAlign(element) && isAlignFormat(format)) {
    return element.align === format;
  } else if (isHeading(element) && isHeadingFormat(format)) {
    return element.depth === getHeadingDepth(format);
  } else if (isList(element) && isListFormat(format)) {
    return element.ordered === getListOrder(format);
  } else {
    const blockType = format2ElementType(format);
    return element.type === blockType;
  }
}

function useRichText(
  editor: Editor
): Omit<RichTextHookReturnValue, "richTextEnabled" | "setRichTextEnabled"> {
  const [activeBlocks, setActiveBlocks] = useState<ActiveBlocks>({
    h1: false,
    h2: false,
    blockQuote: false,
    orderedList: false,
    unorderedList: false,
  });

  const [activeMarks, setActiveMarks] = useState<ActiveMarks>({
    code: false,
    strong: false,
    emphasis: false,
    underline: false,
  });

  const toggleMark = useCallback(
    (format: Format) => {
      const active = isMarkActive(format);
      if (active) {
        Editor.removeMark(editor, format);
      } else {
        Editor.addMark(editor, format, true);
      }
    },
    [editor]
  );

  const isBlockActive = useCallback(
    (format: BlockFormat) => {
      const { selection } = editor;
      if (!selection) return false;

      const [match] = Array.from(
        Editor.nodes(editor, {
          at: Editor.unhangRange(editor, selection),
          match: (n) => {
            return (
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              hasElementFormat(n, format)
            );
          },
        })
      );

      return !!match;
    },
    [editor]
  );

  const isMarkActive = useCallback(
    (format: MarkFormat) => {
      const marks = Editor.marks(editor);
      return marks ? marks[format] === true : false;
    },
    [editor]
  );

  const insertNestedList = useCallback(
    (format: ListFormat) => {
      const { selection } = editor;
      if (!selection) {
        return false;
      }

      const listItem = Editor.parent(editor, selection);
      if (!isListItem(listItem)) {
        return false;
      }

      const [, listItemPath] = listItem;

      const prevListItem = Editor.previous(editor, { at: listItemPath });
      if (!prevListItem) {
        return false;
      }

      const [, prevListItemPath] = prevListItem;

      const prevListItemChildren = Array.from(
        Node.children(editor, prevListItemPath)
      );

      const nestedList: CustomElement = {
        type: "list",
        ordered: getListOrder(format),
        children: [],
      };
      Transforms.wrapNodes(editor, nestedList, { at: listItemPath });

      prevListItemChildren
        .filter(([n]) => Text.isText(n))
        .forEach(([, at]) => {
          const paragraph: CustomElement = {
            type: "paragraph",
            children: [],
          };
          Transforms.wrapNodes(editor, paragraph, { at });
        });

      Transforms.moveNodes(editor, {
        at: listItemPath,
        to: prevListItemPath.concat(1),
      });
    },
    [editor]
  );

  const removeBlock = useCallback(
    (format: BlockFormat) => {
      const listFormat = isListFormat(format);

      Transforms.unwrapNodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          isList(n) &&
          !isAlignFormat(format),
        split: true,
      });

      let newProperties: Partial<Element> | undefined = undefined;
      if (isAlignFormat(format)) {
        newProperties = {
          align: undefined,
        };
      } else if (listFormat) {
        newProperties = {
          type: "listItem",
        };
      } else if (isHeadingFormat(format)) {
        newProperties = {
          type: "heading",
          depth: getHeadingDepth(format),
        };
      } else if (format === "block-quote") {
        newProperties = {
          type: "blockquote",
        };
      }
      if (newProperties) {
        Transforms.setNodes<Element>(editor, newProperties);
      }
    },
    [editor]
  );

  const closeList = useCallback(() => {
    const prev = Editor.previous(editor, { match: (n) => isList(n) });
    if (prev) {
      const [prevNode, prevPath] = prev;
      if (isList(prevNode)) {
        const { node: textNode, path: textPath } = getSelectionNode(editor);
        if (
          textPath &&
          Path.isAncestor(prevPath, textPath) &&
          Text.isText(textNode) &&
          !textNode.text
        ) {
          const [textParentNode, textParentPath] = Editor.parent(
            editor,
            textPath
          );
          Transforms.removeNodes(editor, { at: textParentPath });
          Transforms.insertNodes<Element>(
            editor,
            {
              type: "paragraph",
              children: [{ text: "" }],
            },
            {
              mode: isListItem(textParentNode) ? "lowest" : "highest",
            }
          );
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }, [editor]);

  const toggleBlock = useCallback(
    (format: BlockFormat) => {
      const active = isBlockActive(format);

      const listFormat = isListFormat(format);

      Transforms.unwrapNodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          isList(n) &&
          !isAlignFormat(format),
        split: true,
      });

      let newProperties: Partial<Element> | undefined = undefined;
      if (isAlignFormat(format)) {
        newProperties = {
          align: active ? undefined : format,
        };
      } else if (active) {
        newProperties = {
          type: "paragraph",
        };
      } else if (listFormat) {
        newProperties = {
          type: "listItem",
        };
      } else if (isHeadingFormat(format)) {
        newProperties = {
          type: "heading",
          depth: getHeadingDepth(format),
        };
      } else if (format === "block-quote") {
        newProperties = {
          type: "blockquote",
        };
      }
      if (newProperties) {
        Transforms.setNodes<Element>(editor, newProperties);
      }

      if (!active && listFormat) {
        const block: CustomElement = {
          type: "list",
          ordered: getListOrder(format),
          children: [],
        };
        Transforms.wrapNodes(editor, block);
      }
    },
    [editor]
  );

  const insertList = useCallback(() => {
    const { node, path } = getSelectionNode(editor, false);
    if (node && path) {
      const [parent] = Editor.parent(editor, path);
      if (
        Text.isText(node) &&
        /^ *(?:[*+-]|1[.)])$/.test(node.text) &&
        !isListItem(parent)
      ) {
        Transforms.insertText(editor, node.text.replace(/([*+-]|1[.)])/, ""), {
          at: path,
        });
        toggleBlock(
          /^ *1[.)]$/.test(node.text) ? "ordered-list" : "unordered-list"
        );
        return true;
      }
    }
    return false;
  }, [editor]);

  const setActiveBlocksAndMarks = useCallback(() => {
    setActiveBlocks({
      h1: isBlockActive("h1"),
      h2: isBlockActive("h2"),
      blockQuote: isBlockActive("block-quote"),
      orderedList: isBlockActive("ordered-list"),
      unorderedList: isBlockActive("unordered-list"),
    });
    setActiveMarks({
      code: isMarkActive("code"),
      strong: isMarkActive("strong"),
      emphasis: isMarkActive("emphasis"),
      underline: isMarkActive("underline"),
    });
  }, [isBlockActive, isMarkActive]);

  const deleteEmptyListElement = useCallback(
    (path: Path) => {
      const firstEntry = Editor.node(editor, [0]);
      if (firstEntry) {
        const [firstEntryNode, firstEntryPath] = firstEntry;
        if (
          isList(firstEntryNode) &&
          Node.string(firstEntryNode).length === 0
        ) {
          const isChild = Array.from(
            Node.children(firstEntryNode, firstEntryPath)
          ).some(([_, childPath]) => Path.isChild(path, childPath));
          if (isChild) {
            Transforms.insertNodes(
              editor,
              {
                type: "paragraph",
                children: [{ text: "" }],
              },
              { at: [1] }
            );
            Transforms.removeNodes(editor, {
              at: [0],
            });
            return true;
          }
          return false;
        }
        return false;
      }
      return false;
    },
    [editor]
  );

  const handleSpacePress = useCallback(insertList, [insertList]);

  const handleTabPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const entry = Editor.previous(editor, { match: (n) => isList(n) });
      if (entry) {
        const [node] = entry;
        if (isList(node)) {
          if (event.shiftKey) {
            removeBlock(node.ordered ? "ordered-list" : "unordered-list");
          } else {
            insertNestedList(node.ordered ? "ordered-list" : "unordered-list");
          }
          return true;
        }
        return false;
      }
      return false;
    },
    [editor]
  );

  const handleEnterPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const listClosed = closeList();
      if (listClosed) {
        event.preventDefault();
      }
      return listClosed;
    },
    [closeList]
  );

  return {
    toggleMark,
    toggleBlock,
    activeBlocks,
    activeMarks,
    deleteEmptyListElement,
    setActiveBlocksAndMarks,
    handleSpacePress,
    handleTabPress,
    handleEnterPress,
  };
}

export default useRichText;
