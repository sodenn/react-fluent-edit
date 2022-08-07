import { RenderElementProps, useFocused, useSelected } from "slate-react";
import { isMentionElement } from "../utils";

const MentionsComponent = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const selected = useSelected();
  const focused = useFocused();

  if (!isMentionElement(element)) {
    return null;
  }

  return (
    <span
      {...attributes}
      style={{
        ...{
          padding: "0px 4px 0px",
          margin: "0 1px",
          verticalAlign: "baseline",
          display: "inline-block",
          borderRadius: 4,
          color: "#4b4b4b",
          backgroundColor: "#dfdfdf",
          wordBreak: "break-word",
          boxShadow:
            selected && focused
              ? "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
              : "none",
          cursor: "pointer",
        },
        ...element.style,
      }}
      contentEditable={false}
      data-testid={`mention-${element.value.replace(" ", "-")}`}
    >
      {element.trigger}
      {element.value}
      {children}
    </span>
  );
};

export default MentionsComponent;
