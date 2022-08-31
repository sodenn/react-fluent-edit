import { isParagraph } from "@react-fluent-edit/core";
import { Editor, Node, Range, Transforms } from "slate";
import { rules } from "../utils/tokenizer";

function withMarkdown(editor: Editor) {
  const { insertText, deleteBackward, apply } = editor;

  // Text Completion: Automatically inserts the next bullet point
  editor.apply = (op) => {
    if (op.type === "split_node" && isParagraph(op.properties)) {
      const prev = Editor.node(editor, op.path);
      if (prev) {
        const [prevNode, prevPath] = prev;
        if (isParagraph(prevNode)) {
          const prevStr = Node.string(prevNode);
          const match = prevStr.match(rules.list);
          if (match) {
            if (match[0] === prevStr) {
              Transforms.insertText(editor, "", { at: prevPath });
              return;
            } else {
              const prevSign = match[0].trim().replace(".", "");
              const num = parseInt(prevSign);
              const sign = isNaN(num) ? prevSign + " " : num + 1 + ". ";
              Transforms.insertText(editor, sign);
              Transforms.move(editor);
            }
          }
        }
      }
    }
    apply(op);
  };

  // Text Completion: Automatically inserts a second char (*_`~)
  // and places the cursor between them.
  editor.insertText = (text) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const before = Editor.before(editor, start);
      const beforeRange = Editor.range(editor, start, before);
      const beforeText = Editor.string(editor, beforeRange, { voids: true });
      if (
        ((!beforeText.trim() || ["_", "`", "~"].includes(text)) &&
          ["_", "`", "~"].includes(text)) ||
        (text === "*" && (beforeText === " " || beforeText === "*"))
      ) {
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
      const beforeText = Editor.string(editor, beforeRange, { voids: true });
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange, { voids: true });
      if (
        ["*", "_", "`", "~"].includes(beforeText) &&
        beforeText == afterText
      ) {
        Transforms.delete(editor, { at: afterRange });
      }
    }
    deleteBackward(unit);
  };

  return editor;
}

export default withMarkdown;
