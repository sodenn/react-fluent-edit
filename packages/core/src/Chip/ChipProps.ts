import { ElementType, HTMLAttributes } from "react";
import { RenderElementProps } from "slate-react";

type ChipComponent = ElementType<Omit<RenderElementProps, "element">>;

type ChipProps = Omit<RenderElementProps, "element"> &
  Omit<HTMLAttributes<HTMLSpanElement>, "attributes" | "children">;

export { ChipProps, ChipComponent };
