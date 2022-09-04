import { Editor, Range, Transforms } from "slate";
import { rules } from "../utils/tokenizer";

function withMarkdown(editor: Editor) {
  const { insertText, deleteBackward, apply } = editor;

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

  // Automatically deletes markdown chars
  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const before = Editor.before(editor, start);
      const beforeRange = Editor.range(editor, start, before);
      const beforeChar = Editor.string(editor, beforeRange);
      const beforeLine = Editor.before(editor, start, { unit: "line" });
      const beforeLineRange =
        beforeLine && Editor.range(editor, beforeLine, start);
      const beforeText =
        beforeLineRange && Editor.string(editor, beforeLineRange);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterChar = Editor.string(editor, afterRange);
      const removeSpan =
        ["*", "_", "`", "~"].includes(beforeChar) && beforeChar == afterChar;
      const listMatch = beforeText && beforeText.match(rules.listItemStart);
      const removeSymbol = listMatch && listMatch[0] === beforeText;
      if (removeSpan) {
        Transforms.delete(editor, { at: afterRange });
      } else if (removeSymbol) {
        Transforms.delete(editor, { at: beforeLineRange });
        Transforms.insertNodes(editor, {
          type: "paragraph",
          children: [{ text: "" }],
        });
      }
    }
    deleteBackward(unit);
  };

  return editor;
}

export default withMarkdown;
