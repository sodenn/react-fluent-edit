import {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ChipComponent } from "../Chip";
import { ComboboxComponent, ComboboxItemComponent } from "../Combobox";
import { Plugin } from "../types";

interface FluentEditProps
  extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
  multiline?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  plugins?: Plugin[];
  chipComponent?: ChipComponent;
  comboboxComponent?: ElementType<
    ComboboxComponent & HTMLAttributes<HTMLUListElement>
  >;
  comboboxRootStyle?: CSSProperties;
  comboboxItemComponent?: ElementType<
    ComboboxItemComponent & HTMLAttributes<HTMLLIElement>
  >;
}

interface FluentEditInternalProps extends FluentEditProps {
  multiline: boolean;
}

export type { FluentEditProps, FluentEditInternalProps };
