import { ElementType, HTMLAttributes } from "react";
import { RenderElementProps } from "slate-react";

type RenderProps = Omit<RenderElementProps, "element" | "attributes"> & {
  attributes: Omit<Pick<RenderElementProps, "attributes">, "ref">;
};

type ChipComponent = ElementType<RenderProps>;

type ChipProps = RenderProps &
  Omit<HTMLAttributes<HTMLSpanElement>, "attributes" | "children">;

export { ChipProps, ChipComponent };
