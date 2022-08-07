import { RenderLeafProps } from "slate-react";

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.strong) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.emphasis) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
