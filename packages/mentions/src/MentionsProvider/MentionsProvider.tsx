import {
  editorToDomNode,
  Mention as MentionElement,
  useFluentEdit,
  WithChildrenProp,
} from "@react-fluent-edit/core";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { Editor, Element, Node, Range, Text, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { Mention, MentionItem } from "../types";
import { escapeRegExp, getMentionNodes, isMentionElement } from "../utils";
import {
  FindMentionsOptions,
  InsertOperation,
  MentionsContext,
  RenameMentionsOptions,
} from "./MentionsProviderProps";

// @ts-ignore
const MentionsCtx = createContext<MentionsContext>(undefined);

function MentionsProvider({ children }: WithChildrenProp) {
  const { editor } = useFluentEdit();
  const [mentions, setMentions] = useState<Mention[]>([]);
  const editorSelection = useRef(editor?.selection);

  const getInsertOperation = (): InsertOperation | undefined => {
    if (!editor) {
      return;
    }
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection) && editor) {
      const [start] = Range.edges(selection);
      const prev = Editor.previous(editor);
      const next = Editor.next(editor);

      if (prev && isMentionElement(prev[0])) {
        return { operation: "insert-space", direction: "before" };
      }

      if (next && isMentionElement(next[0])) {
        return { operation: "insert-space", direction: "after" };
      }

      const charBefore = Editor.before(editor, start, { unit: "character" });
      const beforeRange = charBefore && Editor.range(editor, charBefore, start);
      const beforeText =
        beforeRange && Editor.string(editor, beforeRange, { voids: true });

      const charAfter = Editor.after(editor, start, { unit: "character" });
      const afterRange = charAfter && Editor.range(editor, charAfter, start);
      const afterText =
        afterRange && Editor.string(editor, afterRange, { voids: true });

      const triggers = mentions
        .map((m) => escapeRegExp(m.trigger))
        .filter((t) => t.length === 1)
        .join("");
      const pattern = `[^\\s${triggers}]`;
      const regex = new RegExp(pattern);

      if (
        beforeText &&
        regex.test(beforeText) &&
        (!afterText || afterText === " ")
      ) {
        return { operation: "insert-space", direction: "before" };
      }

      if (
        (!beforeText || beforeText === " ") &&
        afterText &&
        regex.test(afterText)
      ) {
        return { operation: "insert-space", direction: "after" };
      }

      if (
        (!beforeText || beforeText === " ") &&
        (!afterText || afterText === " ")
      ) {
        return { operation: "insert-node" };
      }
    }
  };

  const restoreSelection = () => {
    if (editor && !editor.selection && editorSelection.current) {
      Transforms.select(editor, editorSelection.current);
    }
  };

  const openMentionsCombobox = useCallback(
    (trigger: string) => {
      if (!editor) {
        return;
      }

      restoreSelection();
      ReactEditor.focus(editor);

      const operation = getInsertOperation();
      if (operation) {
        if (
          operation.operation === "insert-space" &&
          operation.direction === "before"
        ) {
          Editor.insertText(editor, ` ${trigger}`);
          return;
        }

        if (
          operation.operation === "insert-space" &&
          operation.direction === "after"
        ) {
          Editor.insertText(editor, `${trigger} `);
          Transforms.move(editor, {
            distance: 1,
            unit: "character",
            reverse: true,
          });
          return;
        }

        if (operation.operation === "insert-node") {
          Editor.insertText(editor, trigger);
          return;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor]
  );

  const findMentionEntries = ({ trigger, text }: FindMentionsOptions) => {
    if (!editor) {
      return [];
    }
    return getMentionNodes(editor).filter((entry) => {
      const [node] = entry;
      return node.trigger === trigger && (!text || text === node.value);
    });
  };

  const removeMentions = useCallback(
    (opt: FindMentionsOptions) => {
      if (!editor) {
        return;
      }

      Editor.withoutNormalizing(editor, () => {
        // remove the space at the end of previous text nodes
        findMentionEntries(opt).forEach((entry) => {
          const [, path] = entry;
          const prev = Editor.previous(editor, { at: path });
          if (prev) {
            const [prevNode, prevPath] = prev;
            if (Text.isText(prevNode) && prevNode.text.endsWith(" ")) {
              Transforms.removeNodes(editor, { at: prevPath });
              Transforms.insertNodes(
                editor,
                { text: prevNode.text.trim() },
                { at: prevPath }
              );
            }
          }
        });

        Transforms.removeNodes(editor, {
          at: [],
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            isMentionElement(n) &&
            n.trigger === opt.trigger &&
            (!opt.text || opt.text === n.value),
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor]
  );

  const hasMentions = useCallback(
    (opt: FindMentionsOptions) => findMentionEntries(opt).length > 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const addMention = useCallback(
    ({ text, trigger }: MentionItem) => {
      if (!editor) {
        return;
      }

      restoreSelection();

      const style = mentions.find((m) => m.trigger === trigger)?.style;
      const mentionElement: MentionElement = {
        type: "mention",
        trigger,
        style,
        value: text,
        children: [{ text: "" }],
      };

      // add space before mention
      let selection = editor.selection;
      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const before = Editor.before(editor, start);
        const beforeRange = Editor.range(editor, start, before);
        const beforeChar = Editor.string(editor, beforeRange);
        if (beforeChar.trim()) {
          Transforms.insertText(editor, " ");
        }
      }

      Transforms.insertNodes(editor, mentionElement);
      Transforms.move(editor);

      // add space after mention
      selection = editor.selection;
      if (selection && Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection);
        const after = Editor.after(editor, start);
        const afterRange = Editor.range(editor, start, after);
        const afterChar = Editor.string(editor, afterRange);
        if (afterChar.trim()) {
          Transforms.insertText(editor, " ");
          Transforms.move(editor);
        }
      }

      ReactEditor.focus(editor);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mentions]
  );

  const renameMentions = useCallback(
    ({ text, newText, trigger }: RenameMentionsOptions) => {
      if (!editor) {
        return;
      }

      const match = (n: Node) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        isMentionElement(n) &&
        n.trigger === trigger &&
        (!text || text === n.value);

      const nodes = Array.from(
        Editor.nodes(editor, {
          at: [],
          match,
        })
      );

      if (nodes.length) {
        Transforms.setNodes(
          editor,
          { value: newText },
          {
            at: [],
            match,
          }
        );
      } else {
        addMention({ text: newText, trigger });
      }
    },
    [editor, addMention]
  );

  useEffect(() => {
    const editorElem = editorToDomNode(editor);
    const handleBlur = () => {
      editorSelection.current = editor?.selection;
    };
    editorElem?.addEventListener("blur", handleBlur);
    return () => {
      editorElem?.removeEventListener("blur", handleBlur);
    };
  }, [editor]);

  const value = {
    setMentions,
    addMention,
    hasMentions,
    removeMentions,
    renameMentions,
    openMentionsCombobox,
  };

  return <MentionsCtx.Provider value={value}>{children}</MentionsCtx.Provider>;
}

export default MentionsProvider;

export { MentionsCtx };
