import { DragEvent } from "react";
import { Editor, Path, Point, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { DnDMatchFn } from "../types";
import { getDnD } from "../utils";

function handleDragOver(event: DragEvent<HTMLDivElement>, editor: Editor) {
  event.preventDefault();
  const range = ReactEditor.findEventRange(editor, event);
  Transforms.select(editor, range);
  ReactEditor.focus(editor);
  return true;
}

function handleDrop(
  event: DragEvent<HTMLDivElement>,
  editor: Editor,
  match: DnDMatchFn
) {
  event.preventDefault();
  const range = ReactEditor.findEventRange(editor, event);
  if (Range.isCollapsed(range)) {
    const start = Range.start(range);
    const charBefore = Editor.before(editor, start, { unit: "character" });
    const beforeRange = charBefore && Editor.range(editor, charBefore, start);
    const beforeText =
      beforeRange && Editor.string(editor, beforeRange, { voids: true });
    const charAfter = Editor.after(editor, start, { unit: "character" });
    const afterRange = charAfter && Editor.range(editor, charAfter, start);
    const afterText =
      afterRange && Editor.string(editor, afterRange, { voids: true });
    const pathStr = event.dataTransfer.getData("rfe-path");
    const path = pathStr && (JSON.parse(pathStr) as Path);
    const isBefore = path && Point.isBefore(start, { path, offset: 0 });
    const isAfter = path && Point.isAfter(start, { path, offset: 0 });
    const text = event.dataTransfer.getData("rfe-dnd");
    const dnd = getDnD(text, match);

    if (isBefore) {
      // remove old DnD node
      Transforms.removeNodes(editor, { at: path });
    }

    const nodes = beforeText?.trim()
      ? [{ text: " " }, dnd]
      : afterText?.trim()
      ? [dnd, { text: " " }]
      : [dnd, { text: "" }];

    Transforms.select(editor, range);
    Transforms.insertNodes(editor, nodes, { at: range });
    if (!path) {
      Transforms.move(editor);
      Transforms.move(editor);
    }

    if (isAfter) {
      // remove old DnD node
      Transforms.removeNodes(editor, { at: path });
    }

    return true;
  }
}

export { handleDragOver, handleDrop };
