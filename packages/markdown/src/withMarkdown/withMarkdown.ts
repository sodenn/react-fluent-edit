import { Editor, Range, Transforms } from "slate";
import { MarkdownPluginOptions } from "../types";
import { rules } from "../utils/tokenizer";

function isDisabled(char: string, options: MarkdownPluginOptions) {
  const disabled = options.disabled || {};
  if ((char === "*" || char === "_") && (disabled.strong || disabled.em)) {
    return true;
  } else if (char === "~" && disabled.del) {
    return true;
  } else if (char === "`" && disabled.codespan) {
    return true;
  } else {
    return false;
  }
}

function withMarkdown(editor: Editor, options: MarkdownPluginOptions = {}) {
  const { insertText, deleteBackward } = editor;

  // Text Completion: Automatically inserts a second char (*_`~)
  // and places the cursor between them.
  editor.insertText = (text) => {
    const { selection } = editor;
    if (
      selection &&
      Range.isCollapsed(selection) &&
      !isDisabled(text, options)
    ) {
      const [start] = Range.edges(selection);
      const before = Editor.before(editor, start, { unit: "line" });
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange
        ? Editor.string(editor, beforeRange, { voids: true })
        : "";
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterChar = Editor.string(editor, afterRange);
      if (
        (/[_`~]/.test(text) && /(^| |[_`~])$/.test(beforeText)) ||
        (text === "*" && (beforeText.endsWith(" ") || afterChar === "*"))
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
      const removeListSymbol = listMatch && listMatch[0] === beforeText;
      if (removeSpan && !isDisabled(beforeChar, options)) {
        Transforms.delete(editor, { at: afterRange });
      } else if (removeListSymbol && !options.disabled?.list) {
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
