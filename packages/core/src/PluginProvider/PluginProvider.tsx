import { createContext, useEffect, useState } from "react";
import { Descendant } from "slate";
import { Decorate, Plugin } from "../types";
import { PluginProviderProps } from "./PluginProviderProps";

const defaultSerializer = (node: Descendant[]) => node;

const defaultDecorate: Decorate = () => [];

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
    decorate: p.decorate ?? defaultDecorate,
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
