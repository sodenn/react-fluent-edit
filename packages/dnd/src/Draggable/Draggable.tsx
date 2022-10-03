import { defaultMatch, getDnD } from "../utils";
import { DraggableProps } from "./DraggableProps";

const Draggable = ({
  value,
  component: Component,
  match = defaultMatch,
}: DraggableProps) => {
  const dnd = getDnD(value, match);

  const handleDragStart = (event: any) => {
    event.dataTransfer.setData("rfe-dnd", value);
  };

  return (
    <Component draggable contentEditable={false} onDragStart={handleDragStart}>
      {dnd.value}
    </Component>
  );
};

export default Draggable;
