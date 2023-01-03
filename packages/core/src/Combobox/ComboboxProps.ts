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
  open: boolean;
  onClose: (
    event: ComboboxCloseEvents,
    reason: ComboboxCloseReason,
    index: number
  ) => void;
  onSelectItem?: (index: number) => void;
  range?: BaseRange | null;
}

interface ComboboxItemProps
  extends WithChildrenProp,
    Pick<HTMLAttributes<HTMLLIElement>, "onClick"> {
  selected?: boolean;
}

interface ComboboxComponent extends WithChildrenProp {
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
