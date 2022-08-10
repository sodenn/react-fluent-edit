import { createContext, useEffect, useState } from "react";
import { Descendant } from "slate";
import { Plugin } from "../types";
import { PluginProviderProps } from "./PluginProviderProps";

const defaultSerializer = (node: Descendant[]) => node;

// @ts-ignore
const PluginCtx = createContext<Required<Plugin>[]>(undefined);

const normalizePlugins = (plugins: Plugin[] = []): Required<Plugin>[] =>
  plugins.map((p) => ({
    name: p.name,
    leaves: p.leaves ?? [],
    elements: p.elements ?? [],
    handlers: p.handlers ?? {},
    beforeSerialize: p.beforeSerialize ?? { handler: defaultSerializer },
    afterDeserialize: p.afterDeserialize ?? { handler: defaultSerializer },
    overrides: p.overrides ?? [],
    options: p.options ?? {},
  }));

const PluginProvider = ({
  children,
  plugins: _plugins,
}: PluginProviderProps) => {
  const [plugins, setPlugins] = useState<Required<Plugin>[]>(() =>
    normalizePlugins(_plugins)
  );

  useEffect(() => {
    setPlugins(normalizePlugins(plugins));
  }, [_plugins]);

  return <PluginCtx.Provider value={plugins}>{children}</PluginCtx.Provider>;
};

export default PluginProvider;

export { PluginCtx };
