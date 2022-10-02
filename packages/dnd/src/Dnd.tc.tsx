import {
  FluentEdit,
  FluentEditProps,
  FluentEditProvider,
} from "@react-fluent-edit/core";
import { useState } from "react";
import createDnDPlugin from "./createDnDPlugin";
import Draggable from "./Draggable";

const plugins = [createDnDPlugin()];

const DndPlayground = (props: FluentEditProps) => {
  return (
    <FluentEditProvider>
      <Internal {...props} />
    </FluentEditProvider>
  );
};

const Internal = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ minWidth: 500 }}>
      <div style={{ marginBottom: 8, display: "flex", gap: 4 }}>
        <Draggable component="div" value="{{Lorem ipsum}}" />
      </div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          plugins={plugins}
          initialValue={value}
          onChange={setValue}
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

export default DndPlayground;
