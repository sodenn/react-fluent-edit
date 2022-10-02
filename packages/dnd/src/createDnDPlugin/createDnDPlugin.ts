import { Plugin } from "@react-fluent-edit/core";
import DnDElement from "../DnDElement";
import "../DragDropTouch";
import { handleDragOver, handleDrop } from "../handlers";
import { DnDPluginOptions } from "../types";
import { defaultMatch, withDnDNodes, withoutDnDNodes } from "../utils";
import withDnD from "../withDnD";

function createDnDPlugin(options: DnDPluginOptions = {}): Plugin {
  const match = options.match || defaultMatch;
  return {
    name: "dnd",
    override: withDnD,
    beforeSerialize: {
      handler: (nodes) => {
        return withoutDnDNodes(nodes);
      },
    },
    afterDeserialize: {
      handler: (nodes, options: DnDPluginOptions) => {
        return withDnDNodes(nodes, match);
      },
    },
    element: {
      match: ({ element: { type } }) => type === "dnd",
      component: DnDElement,
    },
    handlers: {
      onDragOver: {
        priority: options.handlers?.onDragOver?.priority,
        handler: handleDragOver,
      },
      onDrop: {
        priority: options.handlers?.onDrop?.priority,
        handler: (event, editor) => handleDrop(event, editor, match),
      },
    },
    options,
  };
}

export default createDnDPlugin;

export { defaultMatch };
