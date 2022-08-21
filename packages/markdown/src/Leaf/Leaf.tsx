import { Plugin, usePlugins } from "@react-fluent-edit/core";
import { CSSProperties } from "react";
import { RenderLeafProps } from "slate-react";
import { MarkdownPluginOptions } from "../types";

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style: CSSProperties = {};

  const plugin = usePlugins().find(
    (p): p is Required<Plugin<MarkdownPluginOptions>> => p.name === "markdown"
  );

  if (leaf.strong) {
    style.fontWeight = "bold";
  }

  if (leaf.codespan) {
    style.fontFamily = "monospace";
  }

  if (leaf.em) {
    style.fontStyle = "italic";
  }

  if (leaf.del) {
    style.textDecoration = "line-through";
  }

  if (leaf.marker && plugin) {
    style = plugin.options.markerStyle || { color: "#777" };
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

export default Leaf;
