import { useContext } from "react";
import { PluginCtx } from "../PluginProvider";
import { Plugin } from "../types";

function usePlugins<T = {}>(): Required<Plugin<T>>[];
function usePlugins<T = {}>(name: string): Required<Plugin<T>>;
function usePlugins<T = {}>(name?: string) {
  const context = useContext(PluginCtx);

  if (context === undefined) {
    throw new Error("usePlugins must be used within a PluginCtx");
  }

  if (typeof name === "undefined") {
    return context;
  } else {
    const plugin = context.find((p) => p.name === name);
    if (!plugin) {
      throw new Error(`Cannot find plugin with name "${name}"`);
    }
    return plugin;
  }
}

export default usePlugins;
