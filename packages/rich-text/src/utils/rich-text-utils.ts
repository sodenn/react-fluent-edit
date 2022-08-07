import { unwrapElement, WithAlign } from "@react-fluent-edit/core";
import { Heading, List, ListItem } from "mdast";
import { Editor, Range } from "slate";

function hasAlign(element: any): element is Required<WithAlign> {
  const elem = unwrapElement<WithAlign>(element);
  return !!elem?.align;
}

function isList(element: any): element is List {
  const elem = unwrapElement<List>(element);
  return elem?.type === "list";
}

function isListItem(element: any): element is ListItem {
  const elem = unwrapElement<ListItem>(element);
  return elem?.type === "listItem";
}

function isHeading(element: any): element is Heading {
  const elem = unwrapElement<Heading>(element);
  return elem?.type === "heading";
}

function getSelectionNode(editor: Editor, mustCollapsed = true) {
  const { selection } = editor;
  if (selection && (Range.isCollapsed(selection) || !mustCollapsed)) {
    const [point] = Range.edges(selection);
    const entry = Editor.node(editor, point);
    if (entry) {
      return {
        node: entry[0],
        path: entry[1],
        selection,
      };
    } else {
      return { selection };
    }
  } else {
    return {};
  }
}

export { hasAlign, isList, isListItem, isHeading, getSelectionNode };
