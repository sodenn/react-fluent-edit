import { useState } from "react";
import FluentEdit from "../FluentEdit";
import FluentEditProvider from "../FluentEditProvider";
import useFluentEdit from "../useFluentEdit";
import { FluentEditProps } from "./FluentEditProps";

const TestComponent = (props: FluentEditProps) => {
  return (
    <FluentEditProvider>
      <Internal {...props} />
    </FluentEditProvider>
  );
};

const Internal = (props: FluentEditProps) => {
  const { focusEditor } = useFluentEdit();
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 400 }}>
      <div style={{ marginBottom: 8 }}>
        <button data-testid="fe-focus" onClick={focusEditor}>
          Focus
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
      <div data-testid="fe-value">{value}</div>
    </div>
  );
};

export default TestComponent;
