import * as React from "react";
import { defaultMatch, getDnD } from "../utils";
import { DraggableProps } from "./DraggableProps";

const Draggable = ({
  value,
  component: Component,
  match = defaultMatch,
}: DraggableProps) => {
  const dnd = getDnD(value, match);
  const Comp = <Component>{dnd.value}</Component>;

  const handleDragStart = (event: any) => {
    event.dataTransfer.setData("rfe-dnd", value);
  };

  return React.cloneElement(Comp, {
    draggable: true,
    contentEditable: false,
    onDragStart: handleDragStart,
  });
};

export default Draggable;
