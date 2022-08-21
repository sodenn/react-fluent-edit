import { isParagraph } from "@react-fluent-edit/core/src";
import { Editor, Range, Transforms } from "slate";
import { isHeading } from "../utils";
import { rules } from "../utils/tokenizer";

function withMarkdown(editor: Editor) {
  const { normalizeNode, insertText, deleteBackward } = editor;

  // Text Completion: Automatically inserts a second char (*_`~)
  // and places the cursor between them.
  editor.insertText = (text) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const textBefore = Editor.string(editor, {
        ...selection,
        anchor: { ...selection.anchor, offset: 0 },
      });
      if (!!textBefore && ["*", "_", "`", "~"].includes(text)) {
        Transforms.insertText(editor, text);
        Transforms.move(editor, { reverse: true });
      }
    }
    insertText(text);
  };

  // Text completion: automatically deletes the following char
  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const before = Editor.before(editor, start);
      const beforeRange = Editor.range(editor, start, before);
      const beforeText = Editor.string(editor, beforeRange);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      if (
        ["*", "_", "`", "~"].includes(beforeText) &&
        beforeText == afterText
      ) {
        Transforms.delete(editor, { at: afterRange });
      }
    }
    deleteBackward(unit);
  };

  editor.normalizeNode = ([node, path]) => {
    const match = Editor.string(editor, path).match(rules.heading);

    if (isHeading(node) && !match) {
      Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
      Transforms.unsetNodes(editor, "depth", { at: path });
    }

    if ((isParagraph(node) || isHeading(node)) && match) {
      const depth = match[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      Transforms.setNodes(editor, { type: "heading", depth }, { at: path });
    }

    normalizeNode([node, path]);
  };

  return editor;
}

export default withMarkdown;
