import { CSSProperties } from "react";
import { RenderElementProps } from "slate-react";
import { hasAlign } from "../utils";

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  const style: CSSProperties = {
    ...(hasAlign(element) && { textAlign: element.align }),
  };

  if (element.type === "heading" && element.depth === 1) {
    return (
      <h1 style={style} {...attributes}>
        {children}
      </h1>
    );
  } else if (element.type === "heading" && element.depth === 2) {
    return (
      <h2 style={style} {...attributes}>
        {children}
      </h2>
    );
  } else if (element.type === "heading" && element.depth === 3) {
    return (
      <h3 style={style} {...attributes}>
        {children}
      </h3>
    );
  } else if (element.type === "heading" && element.depth === 4) {
    return (
      <h4 style={style} {...attributes}>
        {children}
      </h4>
    );
  } else if (element.type === "heading" && element.depth === 5) {
    return (
      <h5 style={style} {...attributes}>
        {children}
      </h5>
    );
  } else if (element.type === "heading" && element.depth === 6) {
    return (
      <h6 style={style} {...attributes}>
        {children}
      </h6>
    );
  } else if (element.type === "list" && element.ordered) {
    return (
      <div style={{ overflowY: "auto" }}>
        <ol style={style} {...attributes}>
          {children}
        </ol>
      </div>
    );
  } else if (element.type === "list" && !element.ordered) {
    return (
      <div style={{ overflowY: "auto" }}>
        <ul style={style} {...attributes}>
          {children}
        </ul>
      </div>
    );
  } else if (element.type === "listItem") {
    return (
      <li style={style} {...attributes}>
        {children}
      </li>
    );
  } else {
    return (
      <p style={{ margin: 0, padding: 0, ...style }} {...attributes}>
        {children}
      </p>
    );
  }
};

export default Element;
