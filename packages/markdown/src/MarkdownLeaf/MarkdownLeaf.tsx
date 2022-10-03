import { usePlugins } from "@react-fluent-edit/core";
import { CSSProperties } from "react";
import { RenderLeafProps } from "slate-react";
import { MarkdownPluginOptions } from "../types";

const MarkdownLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style: CSSProperties = {};

  const plugin = usePlugins<MarkdownPluginOptions>("markdown");

  const { h1, h2, h3, h4, h5, h6, codespan, marker } =
    plugin.options.styles ?? {};

  if (leaf.strong) {
    style.fontWeight = "bold";
  }

  if (leaf.em) {
    style.fontStyle = "italic";
  }

  if (leaf.del) {
    style.textDecoration = "line-through";
  }

  if (leaf.codespan) {
    style = {
      ...style,
      fontFamily: "monospace",
      ...codespan,
    };
  }

  if (leaf.h1) {
    style = {
      ...style,
      fontSize: "2em",
      marginBlockStart: "0.67em",
      marginBlockEnd: "0.67em",
      fontWeight: "bold",
      display: "inline-block",
      ...h1,
    };
  }

  if (leaf.h2) {
    style = {
      ...style,
      fontSize: "1.5em",
      marginBlockStart: "0.83em",
      marginBlockEnd: "0.83em",
      fontWeight: "bold",
      display: "inline-block",
      ...h2,
    };
  }

  if (leaf.h3) {
    style = {
      ...style,
      fontSize: "1.17em",
      marginBlockStart: "1em",
      marginBlockEnd: "1em",
      fontWeight: "bold",
      display: "inline-block",
      ...h3,
    };
  }

  if (leaf.h4) {
    style = {
      ...style,
      marginBlockStart: "1.33em",
      marginBlockEnd: "1.33em",
      fontWeight: "bold",
      display: "inline-block",
      ...h4,
    };
  }

  if (leaf.h5) {
    style = {
      ...style,
      fontSize: "0.83em",
      marginBlockStart: "1.67em",
      marginBlockEnd: "1.67em",
      fontWeight: "bold",
      display: "inline-block",
      ...h5,
    };
  }

  if (leaf.h6) {
    style = {
      ...style,
      fontSize: "0.67em",
      marginBlockStart: "2.33em",
      marginBlockEnd: "2.33em",
      fontWeight: "bold",
      display: "inline-block",
      ...h6,
    };
  }

  if (leaf.marker) {
    style = { ...style, ...{ color: "#777" }, ...marker };
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

export default MarkdownLeaf;
