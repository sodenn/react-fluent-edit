export default `
import { FluentEdit } from "@react-fluent-edit/core";
import { createDnDPlugin, Draggable } from "@react-fluent-edit/dnd";
import { useState } from "react";

const plugins = [createDnDPlugin()];

const Story = () => {
  const [value, setValue] = useState("{{Lorem}} ipsum dolor sit amet.");
  return (
    <div>
      <div style={{ display: "flex", gap: 4 }}>
        <Draggable component="div" value="{{Lorem ipsum}}" />
      </div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          initialValue={value}
          onChange={setValue}
          placeholder="Start typing"
          autoFocus
          plugins={plugins}
          singleLine={false}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      <div>
        {value}
      </div>
    </div>
  );
};

export default Story;
`;
