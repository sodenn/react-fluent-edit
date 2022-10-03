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
  const end = Range.end(range);
  const pathStr = event.dataTransfer.getData("rfe-path");
  const path = pathStr && (JSON.parse(pathStr) as Path);
  const isBefore = path && Point.isBefore(end, { path, offset: 0 });
  const isAfter = path && Point.isAfter(end, { path, offset: 0 });
  const text = event.dataTransfer.getData("rfe-dnd");
  const dnd = getDnD(text, match);

  if (isBefore) {
    Transforms.removeNodes(editor, { at: path });
  }
  Transforms.select(editor, range);
  Transforms.insertNodes(editor, [dnd, { text: "" }], { at: range });
  if (!path) {
    Transforms.move(editor);
    Transforms.move(editor);
  }
  if (isAfter) {
    Transforms.removeNodes(editor, { at: path });
  }

  return true;
}

export { handleDragOver, handleDrop };
