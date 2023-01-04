export default `
import { useState } from "react";
import {
  FluentEdit,
  FluentEditProvider,
  useFluentEdit,
} from "@react-fluent-edit/core";

const Story = () => {
  return (
    <FluentEditProvider>
      <Editor />
    </FluentEditProvider>
  );
};

const Editor = () => {
  const { focusEditor, resetEditor } = useFluentEdit();
  const [value, setValue] = useState("");
  return (
    <div>
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={focusEditor}>
          Focus
        </button>
        <button onClick={() => resetEditor()}>
          Reset
        </button>
      </div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          initialValue={value}
          onChange={setValue}
          placeholder="Start typing"
          autoFocus
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
