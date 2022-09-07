import { useContext } from "react";
import { PluginCtx } from "../PluginProvider";
import { Plugin } from "../types";

function usePlugins<T = {}>(): Required<Plugin<T>>[];
function usePlugins<T = {}>(name: string): Required<Plugin<T>> | undefined;
function usePlugins<T = {}>(name?: string) {
  const context = useContext(PluginCtx);

  if (context === undefined) {
    throw new Error("usePlugins must be used within a PluginCtx");
  }

  if (typeof name === "undefined") {
    return context;
  } else {
    return context.find((p) => p.name === name);
  }
}

export default usePlugins;
