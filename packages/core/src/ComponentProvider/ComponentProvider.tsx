import { createContext } from "react";
import DefaultChip from "../Chip";
import {
  DefaultCombobox,
  DefaultComboboxItem,
} from "../Combobox/DefaultCombobox";
import { ComponentProviderProps, Components } from "./ComponentProviderProps";

// @ts-ignore
const ComponentCtx = createContext<Components>(undefined);

const defaultComboboxRootStyle = {};

const ComponentProvider = ({
  children,
  chipComponent = DefaultChip,
  comboboxComponent = DefaultCombobox,
  comboboxRootStyle = defaultComboboxRootStyle,
  comboboxItemComponent = DefaultComboboxItem,
}: ComponentProviderProps) => {
  return (
    <ComponentCtx.Provider
      value={{
        chipComponent,
        comboboxComponent,
        comboboxRootStyle,
        comboboxItemComponent,
      }}
    >
      {children}
    </ComponentCtx.Provider>
  );
};

export default ComponentProvider;

export { ComponentCtx };
