import {
  Chip,
  ChipProps,
  FluentEdit,
  FluentEditProps,
} from "@react-fluent-edit/core";
import { forwardRef, useState } from "react";
import createDnDPlugin from "./createDnDPlugin";
import Draggable from "./Draggable";

const DraggableComp = forwardRef<HTMLSpanElement>((props, ref) => {
  return (
    <span
      ref={ref}
      {...props}
      style={{
        cursor: "move",
        color: "#213580",
        border: "1px solid #213580",
        backgroundColor: "#dbe2ff",
        padding: "0 4px",
        borderRadius: 4,
      }}
    />
  );
});

const ChipComp = forwardRef<HTMLSpanElement, ChipProps>(
  ({ style, ...props }, ref) => {
    return (
      <Chip
        ref={ref}
        {...props}
        style={{ border: "1px solid grey", ...style }}
      />
    );
  }
);

const plugins = [createDnDPlugin({ chipComponent: ChipComp })];

const DndStage = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ minWidth: 500 }}>
      <div style={{ marginBottom: 8, display: "flex", gap: 4 }}>
        <Draggable component={DraggableComp} value="{{Lorem ipsum}}" />
      </div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          plugins={plugins}
          initialValue={value}
          onChange={setValue}
          //chipComponent={ChipComp}
          {...props}
        />
      </div>
      {value && (
        <div
          data-testid="fe-value"
          style={{
            padding: 8,
            borderRadius: 4,
            marginTop: 12,
            whiteSpace: "pre-wrap",
            backgroundColor: "#efefef",
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default DndStage;
