import { createContext, useEffect, useState } from "react";
import { Plugin } from "../types";
import { normalizePlugins } from "../utils/plugin-utils";
import { PluginProviderProps } from "./PluginProviderProps";

// @ts-ignore
const PluginCtx = createContext<Required<Plugin>[]>(undefined);

const PluginProvider = ({
  children,
  plugins: _plugins,
}: PluginProviderProps) => {
  const [plugins, setPlugins] = useState<Required<Plugin>[]>(() =>
    normalizePlugins(_plugins)
  );

  useEffect(() => {
    setPlugins(normalizePlugins(plugins));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_plugins]);

  return <PluginCtx.Provider value={plugins}>{children}</PluginCtx.Provider>;
};

export default PluginProvider;

export { PluginCtx };
