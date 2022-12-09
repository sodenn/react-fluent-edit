import { TextareaHTMLAttributes } from "react";
import { ChipComponent } from "../Chip";
import { Plugin } from "../types";

interface FluentEditProps
  extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange"> {
  singleLine?: boolean;
  autoFocusPosition?: "start" | "end";
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  plugins?: Plugin[];
  /**
   * @deprecated use initialValue instead
   */
  value?: string | ReadonlyArray<string> | number | undefined;
  chipComponent?: ChipComponent;
}

interface FluentEditInternalProps extends FluentEditProps {
  singleLine: boolean;
}

export type { FluentEditProps, FluentEditInternalProps };
