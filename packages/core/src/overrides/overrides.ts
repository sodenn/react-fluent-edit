import { useCallback } from "react";
import { Editor } from "slate";
import usePlugins from "../usePlugins";

function useOverrides() {
  const plugins = usePlugins();
  return useCallback(
    (editor: Editor) => {
      return plugins
        .flatMap((p) => p.overrides)
        .sort((s1, s2) => (s2.priority || 0) - (s1.priority || 0))
        .map((o) => o.handler)
        .reduce((prev, curr) => curr(editor), editor);
    },
    [plugins]
  );
}

export default useOverrides;
