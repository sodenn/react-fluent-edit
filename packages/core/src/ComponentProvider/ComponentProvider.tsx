import { createContext } from "react";
import Chip from "../Chip";
import { ComponentProviderProps, Components } from "./ComponentProviderProps";

// @ts-ignore
const ComponentCtx = createContext<Components>(undefined);

const ComponentProvider = ({
  children,
  chipComponent = Chip,
}: ComponentProviderProps) => {
  return (
    <ComponentCtx.Provider value={{ chipComponent }}>
      {children}
    </ComponentCtx.Provider>
  );
};

export default ComponentProvider;

export { ComponentCtx };
