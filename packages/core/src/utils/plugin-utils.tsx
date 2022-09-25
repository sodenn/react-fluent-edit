import { Descendant, Editor } from "slate";
import { Decorate, Element, LeafStyle, Plugin } from "../types";

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

function getPluginOptions(plugins: Plugin[]) {
  return plugins.reduce((prev, curr) => {
    prev[curr.name] = curr.options;
    return prev;
  }, {} as { [key: string]: Plugin["options"] });
}

function normalizePlugins(plugins: Plugin[] = []): Required<Plugin>[] {
  return plugins.map((p) => ({
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
}

export { getPluginOptions, normalizePlugins };
