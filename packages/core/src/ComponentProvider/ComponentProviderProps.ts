import { CSSProperties, ElementType, HTMLAttributes } from "react";
import { ChipComponent } from "../Chip";
import { ComboboxComponent, ComboboxItemComponent } from "../Combobox";
import { WithChildrenProp } from "../types";

interface Components {
  chipComponent: ChipComponent;
  comboboxComponent: ElementType<
    ComboboxComponent & HTMLAttributes<HTMLUListElement>
  >;
  comboboxRootStyle: CSSProperties;
  comboboxItemComponent: ElementType<
    ComboboxItemComponent & HTMLAttributes<HTMLLIElement>
  >;
}

type ComponentProviderProps = Partial<Components> & WithChildrenProp;

export type { ComponentProviderProps, Components };
