import {
  CustomRenderElementProps,
  DnD,
  useComponents,
  usePlugins,
} from "@react-fluent-edit/core";
import { ReactEditor, useSlateStatic } from "slate-react";
import { DnDPluginOptions } from "../types";

const DnDElement = ({
  element,
  attributes,
  children,
}: CustomRenderElementProps<DnD>) => {
  const editor = useSlateStatic();
  const plugin = usePlugins<DnDPluginOptions>("dnd");
  const { chipComponent: Chip } = useComponents();
  const Comp = plugin.options.chipComponent || Chip;
  const path = ReactEditor.findPath(editor, element);

  const handleDragStart = (event: any) => {
    event.dataTransfer.setData("rrfe-dnd", element.raw);
    event.dataTransfer.setData("rrfe-path", JSON.stringify(path));
  };

  return (
    <Comp
      attributes={attributes}
      draggable
      onDragStart={handleDragStart}
      style={{ cursor: "move" }}
    >
      {element.value}
      {children}
    </Comp>
  );
};

export default DnDElement;
