import { ElementType, HTMLAttributes } from "react";
import { ChipComponent } from "../Chip";
import {
  ComboboxComponent,
  ComboboxItemComponent,
} from "../Combobox/ComboboxProps";
import { WithChildrenProp } from "../types";

interface Components {
  chipComponent: ChipComponent;
  comboboxComponent: ElementType<
    ComboboxComponent & HTMLAttributes<HTMLUListElement>
  >;
  comboboxItemComponent: ElementType<
    ComboboxItemComponent & HTMLAttributes<HTMLLIElement>
  >;
}

type ComponentProviderProps = Partial<Components> & WithChildrenProp;

export type { ComponentProviderProps, Components };
