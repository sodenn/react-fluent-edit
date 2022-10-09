import { CustomText } from "@react-fluent-edit/core";
import { DragEvent } from "react";
import { Editor, NodeEntry, Path, Point, Range, Text, Transforms } from "slate";
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
    const path = pathStr ? (JSON.parse(pathStr) as Path) : undefined;
    const next = Editor.next(editor, { at: range });
    const isBefore = path && Point.isBefore(start, { path, offset: 0 });
    const isAfter = path && Point.isAfter(start, { path, offset: 0 });
    const text = event.dataTransfer.getData("rfe-dnd");
    const dnd = getDnD(text, match);
    const nodes = beforeText?.trim()
      ? [{ text: " " }, dnd]
      : afterText?.trim()
      ? [dnd, { text: " " }]
      : [dnd, { text: "" }];

    Editor.withoutNormalizing(editor, () => {
      if (isBefore) {
        // remove old DnD node
        Transforms.removeNodes(editor, { at: path });
      }
      Transforms.insertNodes(editor, nodes, { at: range });
      if (isAfter) {
        // remove old DnD node
        Transforms.removeNodes(editor, { at: path });
      }
      // remove trailing spaces
      Array.from(
        Editor.nodes(editor, {
          at: path,
          match: (n) => Text.isText(n),
        })
      )
        .filter((e): e is NodeEntry<CustomText> => true)
        .forEach((entry) => {
          const [node, path] = entry;
          const nodeText = node.text;
          const prev = Editor.previous(editor, { at: path });
          const prevText =
            prev && Text.isText(prev[0]) ? prev[0].text : undefined;
          const isFirst = !prev || (Text.isText(prev[0]) && !prev[0].text);
          const hasTrailingSpace = prevText && /\s$/.test(prevText);
          if (/^\s/.test(nodeText) && (isFirst || hasTrailingSpace)) {
            Transforms.removeNodes(editor, { at: path });
            Transforms.insertNodes(
              editor,
              { text: nodeText.trimStart() },
              { at: path }
            );
          }
        });
    });

    // Place the cursor after the DnD entry if there is no other entry
    if (!next) {
      Transforms.move(editor, { unit: "offset", distance: 3 });
    }

    return true;
  }
  return false;
}

export { handleDragOver, handleDrop };
