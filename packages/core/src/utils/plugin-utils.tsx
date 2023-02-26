import React from "react";
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

function getPluginComponentProps(plugin: Plugin, children: React.ReactNode) {
  return React.Children.map(children, (element, index) => {
    if (!React.isValidElement(element)) return {};
    const displayName = (element.type as any).displayName ?? index.toString();
    if (plugin.editorComponents?.some((type) => type === element.type)) {
      return element.props ? { [displayName]: element.props } : {};
    } else {
      return {};
    }
  });
}

function getPluginOptions(plugins: Plugin[], children: React.ReactNode) {
  return plugins.reduce((prev, curr) => {
    const props = getPluginComponentProps(curr, children);
    prev[curr.name] = { ...curr.options, componentProps: props };
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
    editorComponents: p.editorComponents ?? [],
  }));
}

export { getPluginOptions, normalizePlugins, getPluginComponentProps };
