import { useContext } from "react";
import { FluentEditContext, FluentEditCtx } from "../FluentEditProvider";

function useFluentEditInternal(): FluentEditContext | undefined {
  return useContext(FluentEditCtx);
}

export default useFluentEditInternal;
