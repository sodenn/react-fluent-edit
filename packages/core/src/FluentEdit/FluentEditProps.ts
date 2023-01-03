import { ElementType, HTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChipComponent } from "../Chip";
import { ComboboxComponent, ComboboxItemComponent } from "../Combobox";
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
  chipComponent?: ChipComponent;
  comboboxComponent?: ElementType<
    ComboboxComponent & HTMLAttributes<HTMLUListElement>
  >;
  comboboxItemComponent?: ElementType<
    ComboboxItemComponent & HTMLAttributes<HTMLLIElement>
  >;
}

interface FluentEditInternalProps extends FluentEditProps {
  singleLine: boolean;
}

export type { FluentEditProps, FluentEditInternalProps };
