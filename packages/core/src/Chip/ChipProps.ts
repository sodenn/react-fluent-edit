import React, { DetailedHTMLProps, HTMLAttributes } from "react";
import { RenderElementProps } from "slate-react";

type ChipComponent = React.ElementType<Omit<RenderElementProps, "element">>;

type ChipProps = Omit<RenderElementProps, "element"> &
  Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
    "attributes" | "children"
  >;

export { ChipProps, ChipComponent };
