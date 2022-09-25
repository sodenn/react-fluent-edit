import { TextareaHTMLAttributes } from "react";
import { Plugin } from "../types";

interface FluentEditProps
  extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange"> {
  singleLine?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  plugins?: Plugin[];
  /**
   * @deprecated use initialValue instead
   */
  value?: string | ReadonlyArray<string> | number | undefined;
}

interface FluentEditInternalProps extends FluentEditProps {
  singleLine: boolean;
}

export type { FluentEditProps, FluentEditInternalProps };
