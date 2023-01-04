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
  /**
   * Set this to `false` to limit the value to a single line.
   * @default true
   */
  multiline?: boolean;
  /**
   * If `true`, the editor is focused during the first mount.
   * @default undefined
   */
  autoFocus?: boolean;
  /**
   * The short hint displayed in the editor before the user enters a value.
   */
  placeholder?: string;
  /**
   * The initial value of the editor.
   */
  initialValue?: string;
  /**
   * Callback fired when the value is changed.
   */
  onChange?: (value: string) => void;
  /**
   * Plugins to be used.
   */
  plugins?: Plugin[];
  /**
   * This Chip component is available via the `useComponents` hook and can be used
   * in plugins, for example.
   * @default {@link Chip}
   */
  chipComponent?: ChipComponent;
  /**
   * This Combobox component is available via the `useComponents` hook and can be used
   * in plugins, for example.
   * @default {@link DefaultCombobox}
   */
  comboboxComponent?: ElementType<
    ComboboxComponent & HTMLAttributes<HTMLUListElement>
  >;
  /**
   * Extends the styling of the combobox root element.
   */
  comboboxRootStyle?: CSSProperties;
  /**
   * This ComboboxItem component is available via the `useComponents` hook and can be used
   * in plugins, for example.
   * @default {@link DefaultComboboxItem}
   */
  comboboxItemComponent?: ElementType<
    ComboboxItemComponent & HTMLAttributes<HTMLLIElement>
  >;
}

interface FluentEditInternalProps extends FluentEditProps {
  multiline: boolean;
}

export type { FluentEditProps, FluentEditInternalProps };
