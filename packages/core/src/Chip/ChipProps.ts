import { ElementType, HTMLAttributes } from "react";
import { RenderElementProps } from "slate-react";

type ChipProps = Omit<RenderElementProps, "element" | "attributes"> & {
  attributes: Omit<RenderElementProps["attributes"], "ref">;
} & Omit<HTMLAttributes<HTMLSpanElement>, "attributes" | "children">;

type ChipComponent = ElementType<ChipProps>;

export { ChipProps, ChipComponent };
