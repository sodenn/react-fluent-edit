import { KeyboardEvent } from "react";
import { Editor, Location, Range, Transforms } from "slate";
import { addListSymbolToNewLine, moveListItem } from "./list-utils";

function handleKeydown(ev: KeyboardEvent<HTMLDivElement>, editor: Editor) {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return false;
  }

  const [start] = Range.edges(selection);

  if (ev.key === "Tab") {
    if (moveCursor(editor, start)) {
      ev.preventDefault();
      return true;
    }
    if (moveListItem(editor, start, ev.shiftKey)) {
      ev.preventDefault();
      return true;
    }
  }

  if (ev.key === "Enter") {
    if (addListSymbolToNewLine(editor, start)) {
      ev.preventDefault();
      return true;
    }
  }

  return false;
}

function moveCursor(editor: Editor, location: Location) {
  const after = Editor.after(editor, location, {
    unit: "line",
  });
  const range = after && Editor.range(editor, after, location);
  const afterText = range && Editor.string(editor, range);
  if (!afterText) {
    return false;
  }
  return ["**", "*", "_", "`", "~"].some((i) => {
    if (afterText.startsWith(i)) {
      Transforms.move(editor, { unit: "character", distance: i.length });
      if (afterText.endsWith(i)) {
        Transforms.insertText(editor, " ");
      }
      return true;
    }
  });
}

export { handleKeydown };
