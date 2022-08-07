import { useContext } from "react";
import { FluentEditCtx } from "../FluentEditProvider";

function useFluentEditInternal() {
  return useContext(FluentEditCtx);
}

export default useFluentEditInternal;
