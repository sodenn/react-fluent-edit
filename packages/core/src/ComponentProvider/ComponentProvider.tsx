import { createContext } from "react";
import Chip from "../Chip";
import {
  DefaultCombobox,
  DefaultComboboxItem,
} from "../Combobox/DefaultCombobox";
import { ComponentProviderProps, Components } from "./ComponentProviderProps";

// @ts-ignore
const ComponentCtx = createContext<Components>(undefined);

const ComponentProvider = ({
  children,
  chipComponent = Chip,
  comboboxComponent = DefaultCombobox,
  comboboxItemComponent = DefaultComboboxItem,
}: ComponentProviderProps) => {
  return (
    <ComponentCtx.Provider
      value={{ chipComponent, comboboxComponent, comboboxItemComponent }}
    >
      {children}
    </ComponentCtx.Provider>
  );
};

export default ComponentProvider;

export { ComponentCtx };
