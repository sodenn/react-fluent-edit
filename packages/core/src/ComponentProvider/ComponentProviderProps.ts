import { CSSProperties } from "react";
import { ChipComponent } from "../Chip";
import { ComboboxComponent, ComboboxItemComponent } from "../Combobox";
import { WithChildrenProp } from "../types";

interface Components {
  chipComponent: ChipComponent;
  comboboxComponent: ComboboxComponent;
  comboboxRootStyle: CSSProperties;
  comboboxItemComponent: ComboboxItemComponent;
}

type ComponentProviderProps = Partial<Components> & WithChildrenProp;

export type { ComponentProviderProps, Components };
