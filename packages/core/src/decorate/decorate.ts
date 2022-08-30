import { Editor, NodeEntry } from "slate";
import usePlugins from "../usePlugins";

function useDecorate(editor: Editor) {
  const plugins = usePlugins();
  return (entry: NodeEntry) =>
    plugins.flatMap((p) => p.decorate(entry, editor));
}

export default useDecorate;
