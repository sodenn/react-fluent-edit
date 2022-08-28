import {
  cloneChildren,
  CustomText,
  MentionElement,
  Plugin,
  unwrapElement,
  usePlugins,
} from "@react-fluent-edit/core";
import {
  BaseRange,
  createEditor,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Range,
  Text,
  Transforms,
} from "slate";
import { ReactEditor } from "slate-react";
import { Mention, MentionsPluginOptions } from "../types";
import withMentions from "../withMentions";

interface InsertMentionOptions extends Omit<Mention, "suggestions"> {
  editor: Editor;
  value: string;
  target: BaseRange;
}

function isMentionElement(element: any): element is MentionElement {
  const elem = unwrapElement<MentionElement>(element);
  return elem?.type === "mention";
}

function insertMention(opt: InsertMentionOptions) {
  const { trigger, style, value, editor, target } = opt;
  Transforms.select(editor, target);
  const mention: MentionElement = {
    type: "mention",
    trigger,
    style,
    value,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
}

function getUserInputAtSelection(editor: Editor, mentions: Mention[]) {
  const { selection } = editor;

  if (selection && Range.isCollapsed(selection)) {
    const [start] = Range.edges(selection);
    let textBefore = Editor.string(editor, Editor.range(editor, [0, 0], start));
    textBefore = textBefore.substring(textBefore.length - start.offset); // only the current line
    const escapedTriggers = mentions
      .map((m) => m.trigger)
      .map(escapeRegExp)
      .join("|");
    const pattern = `(^|\\s)(${escapedTriggers})(|\\S+)$`;
    const beforeMatch = textBefore.match(new RegExp(pattern));
    const beforeMatchExists =
      !!beforeMatch && beforeMatch.length > 2 && !!beforeMatch[0];
    const offset = beforeMatchExists
      ? start.offset -
        beforeMatch[0].length +
        (beforeMatch[0].startsWith(" ") ? 1 : 0)
      : 0;
    const beforeRange =
      beforeMatch &&
      Editor.range(
        editor,
        {
          ...start,
          offset,
        },
        start
      );
    const mention =
      beforeMatchExists && mentions.find((m) => m.trigger === beforeMatch[2]);

    const after = Editor.after(editor, start);
    const afterRange = Editor.range(editor, start, after);
    const afterText = Editor.string(editor, afterRange);
    const afterMatch = afterText.match(/^(\s|$)/);

    if (beforeMatch && afterMatch && beforeRange && mention) {
      return {
        target: beforeRange,
        mention,
        search: beforeMatch[3],
      };
    }
  }
}

function setSuggestionComboboxPosition(
  editor: Editor,
  popoverElement: HTMLElement,
  target: BaseRange
) {
  try {
    const domRange = ReactEditor.toDOMRange(editor, target);
    const rect = domRange.getBoundingClientRect();

    if (
      popoverElement.offsetWidth + rect.left + window.pageXOffset <
      window.outerWidth - 16
    ) {
      popoverElement.style.left = `${rect.left + window.pageXOffset}px`;
      popoverElement.style.right = "auto";
    } else {
      popoverElement.style.left = "auto";
      popoverElement.style.right = "16px";
    }

    popoverElement.style.top = `${rect.top + window.pageYOffset + 24}px`;
  } catch (e) {
    //
  }
}

function withMentionNodes(
  nodes: Descendant[],
  mentions: Mention[]
): Descendant[] {
  const root: Node = { type: "paragraph", children: cloneChildren(nodes) };

  if (mentions.length === 0) {
    return nodes;
  }

  const textEntries = Array.from(Node.nodes(root)).filter(
    (e): e is NodeEntry<CustomText> => Text.isText(e[0])
  );

  for (const textEntry of textEntries) {
    const [textNode, textPath] = textEntry;
    const text = textNode.text;
    const items = getMentionItems(
      text,
      mentions.map((m) => m.trigger)
    );

    let index = 0;
    const textNodesAndMentions: Descendant[] = [];

    for (const item of items) {
      const { value, start, end, trigger } = item;
      const style = mentions.find((m) => m.trigger === trigger)?.style;

      const textBefore = text.substring(index, start);
      if (textBefore) {
        textNodesAndMentions.push({ text: textBefore });
      }

      const mention: MentionElement = {
        type: "mention",
        trigger,
        value,
        style,
        children: [{ text: "" }],
      };
      textNodesAndMentions.push(mention);

      index = end;
    }

    textNodesAndMentions.push({
      text: text.substring(index),
    });

    const parent = Node.parent(root, textPath);
    const textNodeIndex = parent.children.indexOf(textNode as any);
    parent.children.splice(textNodeIndex, 1, ...textNodesAndMentions);
  }

  return root.children;
}

function addMentionNodes(editor: Editor, mentions: Mention[]) {
  removeMentionNodes(editor);

  const textEntries: NodeEntry<CustomText>[] = Array.from(
    Editor.nodes(editor, { at: [], match: (n) => Text.isText(n) })
  );

  for (const textEntry of textEntries) {
    const [textNode, textPath] = textEntry;
    const text = textNode.text;
    const items = getMentionItems(
      text,
      mentions.map((m) => m.trigger)
    );

    let index = 0;
    const newNodes: Descendant[] = [];
    for (const item of items) {
      const { trigger, value, start, end } = item;

      const textNodeBefore: CustomText = { text: text.slice(index, start) };
      if (textNodeBefore.text) {
        newNodes.push(textNodeBefore);
      }

      const style = mentions.find((m) => m.trigger === trigger)?.style;
      const mention: MentionElement = {
        type: "mention",
        trigger,
        value,
        style,
        children: [{ text: "" }],
      };
      newNodes.push(mention);

      index = end;
    }

    if (index < textNode.text.length) {
      newNodes.push({ text: text.slice(index) });
    }

    const range = Editor.range(editor, textPath);

    Transforms.insertNodes(editor, newNodes, {
      at: range,
    });
  }
}

function removeMentionNodes(editor: Editor) {
  const mentionEntries: Generator<
    NodeEntry<MentionElement>,
    void,
    undefined
  > = Editor.nodes(editor, {
    at: [],
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && isMentionElement(n),
  });

  const { value, done } = mentionEntries.next();

  if (value) {
    const [node, path] = value;
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(
        editor,
        { text: node.trigger + node.value },
        { at: path }
      );
      const next = Editor.next(editor, { at: path });
      if (next) {
        const [, nextPath] = next;
        Transforms.removeNodes(editor, { at: nextPath });
      }
    });
  }

  if (!done) {
    removeMentionNodes(editor);
  }
}

function withoutMentionNodes(nodes: Descendant[]) {
  const editor = withMentions(createEditor());
  editor.children = nodes;
  removeMentionNodes(editor);
  return editor.children;
}

function getMentionItems(text: string, triggers: string[]) {
  const result: {
    value: string;
    trigger: string;
    start: number;
    end: number;
  }[] = [];

  if (triggers.length === 0) {
    return result;
  }

  const pattern = `(\\s|^)(${triggers.map(escapeRegExp).join("|")})\\S+`;

  for (const match of text.matchAll(new RegExp(pattern, "g"))) {
    const trigger = match[2];
    const value = match[0].trim().substring(trigger.length);
    const matchIndex = match.index || 0;
    const start = match[0].startsWith(" ") ? matchIndex + 1 : matchIndex;
    const end = start + match[0].trim().length;
    result.push({
      value,
      trigger,
      start,
      end,
    });
  }

  return result;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function useMentionPlugins() {
  const plugins = usePlugins();
  return plugins.filter(
    (p): p is Required<Plugin<MentionsPluginOptions>> => p.name === "mentions"
  );
}

function getMentionNodes(editor: Editor) {
  return Array.from(
    Editor.nodes(editor, {
      at: [],
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && isMentionElement(n),
    })
  ).map((n) => n as NodeEntry<MentionElement>);
}

export {
  InsertMentionOptions,
  isMentionElement,
  insertMention,
  getUserInputAtSelection,
  setSuggestionComboboxPosition,
  addMentionNodes,
  removeMentionNodes,
  withMentionNodes,
  withoutMentionNodes,
  getMentionItems,
  escapeRegExp,
  useMentionPlugins,
  getMentionNodes,
};
