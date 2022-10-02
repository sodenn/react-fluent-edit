import { useContext } from "react";
import { ComponentCtx } from "../ComponentProvider";

function useComponents() {
  return useContext(ComponentCtx);
}

export default useComponents;
