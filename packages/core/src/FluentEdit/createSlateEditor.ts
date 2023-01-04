import { createEditor, Editor, Text, Transforms } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";

function withoutTab(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (Text.isText(node) && /\t/.test(node.text)) {
      Transforms.insertText(editor, node.text.replace(/\t/g, "  "), {
        at: path,
      });
    }
    normalizeNode([node, path]);
  };

  return editor;
}

function withSingleLine(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length > 1) {
        Transforms.mergeNodes(editor);
      }
    }
    normalizeNode([node, path]);
  };

  return editor;
}

function createSlateEditor(multiline: boolean) {
  let editor = withoutTab(withReact(withHistory(createEditor())));
  if (!multiline) {
    editor = withSingleLine(editor);
  }
  return editor;
}

export default createSlateEditor;
