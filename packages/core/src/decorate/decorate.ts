import { NodeEntry } from "slate";
import usePlugins from "../usePlugins";

function useDecorate() {
  const plugins = usePlugins();
  return (entry: NodeEntry) => plugins.flatMap((p) => p.decorate(entry));
}

export default useDecorate;
