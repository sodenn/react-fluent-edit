import { RenderPlaceholderProps } from "slate-react";

const Placeholder = ({ attributes, children }: RenderPlaceholderProps) => {
  return (
    <span {...attributes} style={{ ...attributes.style, top: 0 }}>
      {children}
    </span>
  );
};

export default Placeholder;
