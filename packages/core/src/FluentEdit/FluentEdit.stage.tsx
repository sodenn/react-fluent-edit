import { useState } from "react";
import FluentEdit from "../FluentEdit";
import FluentEditProvider from "../FluentEditProvider";
import useFluentEdit from "../useFluentEdit";
import { FluentEditProps } from "./FluentEditProps";

const FluentEditStage = (props: FluentEditProps) => {
  return (
    <FluentEditProvider>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = (props: FluentEditProps) => {
  const { focusEditor, resetEditor } = useFluentEdit();
  const [value, setValue] = useState("");
  return (
    <div style={{ minWidth: 500 }}>
      <div style={{ marginBottom: 8, display: "flex", gap: 4 }}>
        <button data-testid="fe-focus" onClick={focusEditor}>
          Focus
        </button>
        <button data-testid="fe-reset" onClick={() => resetEditor()}>
          Reset
        </button>
      </div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          initialValue=""
          autoFocus
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

export default FluentEditStage;
