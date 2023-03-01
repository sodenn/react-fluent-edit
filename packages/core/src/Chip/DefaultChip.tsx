import { useFocused, useSelected } from "slate-react";
import { ChipProps } from "./ChipProps";

const DefaultChip = (props: ChipProps) => {
  const { attributes, children, style, ...rest } = props;
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      style={{
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
        ...style,
      }}
      contentEditable={false}
      {...rest}
    >
      {children}
    </span>
  );
};

export default DefaultChip;
