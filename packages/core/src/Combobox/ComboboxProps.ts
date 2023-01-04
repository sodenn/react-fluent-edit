import { HTMLAttributes } from "react";
import { BaseRange } from "slate";
import { WithChildrenProp } from "../types";

type ComboboxCloseReason =
  | "tabPress"
  | "enterPress"
  | "escapePress"
  | "spacePress"
  | "clickAway";

type ComboboxCloseEvents = KeyboardEvent | FocusEvent | MouseEvent | TouchEvent;

interface ComboboxProps extends WithChildrenProp {
  /**
   * If true, the combobox is shown.
   * @default false
   */
  open?: boolean;
  /**
   * Callback fired when the combobox requests to be closed.
   */
  onClose: (
    event: ComboboxCloseEvents,
    reason: ComboboxCloseReason,
    index?: number
  ) => void;
  /**
   * Callback fired when the selected combobox item changed.
   */
  onSelectItem?: (index: number) => void;
  /**
   * If a `range` is defined, the combobox opens at this point, otherwise at the
   * position of the cursor.
   */
  range?: BaseRange | null;
}

interface ComboboxItemProps
  extends WithChildrenProp,
    Pick<HTMLAttributes<HTMLLIElement>, "onClick"> {
  /**
   * If `true`, the component is initially marked as active. After the first mount,
   * the `selected` state is controlled by the `Combobox` component.
   * @default undefined
   */
  selected?: boolean;
}

interface ComboboxComponent extends WithChildrenProp {
  /**
   * Becomes `true` as soon as the combobox is opened. Useful for animations.
   * @default false
   */
  in?: boolean;
}

type ComboboxItemComponent = ComboboxItemProps;

export type {
  ComboboxProps,
  ComboboxItemProps,
  ComboboxComponent,
  ComboboxItemComponent,
  ComboboxCloseEvents,
  ComboboxCloseReason,
};
