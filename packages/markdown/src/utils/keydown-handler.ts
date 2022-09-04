import { KeyboardEvent } from "react";
import { Editor, Location, Range, Transforms } from "slate";
import { moveListItem } from "./list-utils";

function handleKeydown(ev: KeyboardEvent<HTMLDivElement>, editor: Editor) {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const [start] = Range.edges(selection);
    if (ev.key === "Tab") {
      let handled = moveCursor(editor, start);
      if (handled) {
        ev.preventDefault();
        return true;
      }
      handled = moveListItem(editor, start, ev.shiftKey);
      if (handled) {
        ev.preventDefault();
        return true;
      }
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
        Transforms.move(editor, { unit: "character", distance: 1 });
      }
      return true;
    }
  });
}

export { handleKeydown };
