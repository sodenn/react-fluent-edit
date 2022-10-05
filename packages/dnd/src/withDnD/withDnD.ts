import { Editor } from "slate";

function withDnD(editor: Editor) {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "dnd" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "dnd" ? true : isVoid(element);
  };

  return editor;
}

export default withDnD;
