import { Editor, Text, Transforms } from "slate";
import { isMentionElement } from "../utils";

function withMentions(editor: Editor) {
  const { isInline, isVoid, normalizeNode } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    const prevEntry = Editor.previous(editor, {
      at: path,
      match: (n) => !Text.isText(n) || n.text.length > 0,
    });
    const nextEntry = Editor.next(editor, {
      at: path,
      match: (n) => !Text.isText(n) || n.text.length > 0,
    });

    const prev = prevEntry && prevEntry[0];
    const next = nextEntry && nextEntry[0];
    const nextPath = nextEntry && nextEntry[1];

    const textAfterMention =
      isMentionElement(prev) &&
      Text.isText(node) &&
      !node.text.startsWith(" ") &&
      node.text.length > 0;

    if (textAfterMention) {
      Transforms.insertNodes(editor, { text: " " }, { at: path });
      return;
    }

    const mentionAfterText =
      isMentionElement(next) &&
      Text.isText(node) &&
      !node.text.endsWith(" ") &&
      node.text.length > 0;

    if (mentionAfterText) {
      Transforms.insertNodes(editor, { text: " " }, { at: nextPath });
      return;
    }

    if (isMentionElement(node) && isMentionElement(next)) {
      Transforms.insertNodes(editor, { text: " " }, { at: nextPath });
      return;
    }

    if (isMentionElement(prev) && isMentionElement(node)) {
      Transforms.insertNodes(editor, { text: " " }, { at: path });
      return;
    }

    normalizeNode(entry);
  };

  return editor;
}

export default withMentions;
