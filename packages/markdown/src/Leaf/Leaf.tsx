import { RenderLeafProps } from "slate-react";

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.strong) {
    children = <strong>{children}</strong>;
  }

  if (leaf.inlineCode) {
    children = <code>{children}</code>;
  }

  if (leaf.emphasis) {
    children = <em>{children}</em>;
  }

  if (leaf.delete) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
