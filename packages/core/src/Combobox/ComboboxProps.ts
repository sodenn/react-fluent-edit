import { ElementType, HTMLAttributes } from "react";
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

interface ComboboxItemProps extends WithChildrenProp {
  onClick: () => void;
  selected?: boolean;
}

type ComboboxComponent = ElementType<HTMLAttributes<HTMLUListElement>>;

type ComboboxItemComponent = ElementType<
  ComboboxItemProps & HTMLAttributes<HTMLLIElement>
>;

export type {
  ComboboxProps,
  ComboboxItemProps,
  ComboboxComponent,
  ComboboxItemComponent,
  ComboboxCloseEvents,
  ComboboxCloseReason,
};
