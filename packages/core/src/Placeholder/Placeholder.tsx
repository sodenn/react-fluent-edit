import { RenderPlaceholderProps } from "slate-react";

const Placeholder = ({ attributes, children }: RenderPlaceholderProps) => {
  return (
    <span
      {...attributes}
      style={{ ...attributes.style, fontWeight: 400, textAlign: "left" }}
    >
      {children}
    </span>
  );
};

export default Placeholder;
