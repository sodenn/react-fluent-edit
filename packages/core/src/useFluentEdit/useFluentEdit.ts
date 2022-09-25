import { useContext } from "react";
import { FluentEditCtx } from "../FluentEditProvider";

function useFluentEdit() {
  const { editor, focusEditor, resetEditor } = useContext(FluentEditCtx);
  return {
    editor,
    focusEditor,
    resetEditor,
  };
}

export default useFluentEdit;
