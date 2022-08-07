import { useContext } from "react";
import { PluginCtx } from "../PluginProvider";

function usePlugins() {
  const context = useContext(PluginCtx);

  if (context === undefined) {
    throw new Error("usePlugins must be used within a PluginCtx");
  }

  return context;
}

export default usePlugins;
