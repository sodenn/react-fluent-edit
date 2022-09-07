import { createContext, useEffect, useState } from "react";
import { Descendant, Editor } from "slate";
import { Decorate, Element, LeafStyle, Plugin } from "../types";
import { PluginProviderProps } from "./PluginProviderProps";

const defaultSerializer = { handler: (node: Descendant[]) => node };

const defaultDecorate: Decorate = () => [];

const defaultElement: Element = {
  match: () => false,
  component: () => <span />,
};

const defaultLeaf: LeafStyle = {
  match: () => false,
  style: {},
};

const defaultOverride = (editor: Editor) => editor;

// @ts-ignore
const PluginCtx = createContext<Required<Plugin>[]>(undefined);

const normalizePlugins = (plugins: Plugin[] = []): Required<Plugin>[] =>
  plugins.map((p) => ({
    name: p.name,
    leave: p.leave ?? defaultLeaf,
    element: p.element ?? defaultElement,
    handlers: p.handlers ?? {},
    beforeSerialize: p.beforeSerialize ?? defaultSerializer,
    afterDeserialize: p.afterDeserialize ?? defaultSerializer,
    override: p.override ?? defaultOverride,
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
