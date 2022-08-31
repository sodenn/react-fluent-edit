import { useCallback } from "react";
import { Editor } from "slate";
import usePlugins from "../usePlugins";

function useOverrides() {
  const plugins = usePlugins();
  return useCallback(
    (editor: Editor) => {
      return plugins
        .map((p) => p.override)
        .reduce((prev, curr) => curr(editor), editor);
    },
    [plugins]
  );
}

export default useOverrides;
