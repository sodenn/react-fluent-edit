import { useCallback } from "react";
import { Editor } from "slate";
import usePlugins from "../usePlugins";

function useOverrides() {
  const plugins = usePlugins();
  return useCallback(
    (editor: Editor) => {
      return plugins.reduce((prev, p) => p.override(editor, p.options), editor);
    },
    [plugins]
  );
}

export default useOverrides;
