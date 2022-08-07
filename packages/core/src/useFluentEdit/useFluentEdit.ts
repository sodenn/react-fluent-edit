import { useContext } from "react";
import { FluentEditCtx } from "../FluentEditProvider";

function useFluentEdit() {
  const { editor, focusEditor } = useContext(FluentEditCtx);
  return {
    editor,
    focusEditor,
  };
}

export default useFluentEdit;
