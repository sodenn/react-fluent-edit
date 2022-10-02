import { ChipComponent } from "../Chip";
import { WithChildrenProp } from "../types";

interface Components {
  chipComponent: ChipComponent;
}

type ComponentProviderProps = Partial<Components> & WithChildrenProp;

export type { ComponentProviderProps, Components };
