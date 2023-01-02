import { ChipComponent } from "../Chip";
import {
  ComboboxComponent,
  ComboboxItemComponent,
} from "../Combobox/ComboboxProps";
import { WithChildrenProp } from "../types";

interface Components {
  chipComponent: ChipComponent;
  comboboxComponent: ComboboxComponent;
  comboboxItemComponent: ComboboxItemComponent;
}

type ComponentProviderProps = Partial<Components> & WithChildrenProp;

export type { ComponentProviderProps, Components };
