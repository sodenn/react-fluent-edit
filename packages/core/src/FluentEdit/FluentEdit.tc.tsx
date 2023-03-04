import { useState } from "react";
import FluentEdit from "../FluentEdit";
import FluentEditProvider from "../FluentEditProvider";
import useFluentEdit from "../useFluentEdit";
import { FluentEditProps } from "./FluentEditProps";

const TestComponent = (props: FluentEditProps) => {
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
    <>
      <button data-testid="rfe-focus" onClick={focusEditor}>
        Focus
      </button>
      <button data-testid="rfe-reset" onClick={() => resetEditor()}>
        Reset
      </button>
      <FluentEdit
        autoFocus
        initialValue={value}
        onChange={setValue}
        {...props}
      />
      <div data-testid="rfe-value">{value}</div>
    </>
  );
};

export default TestComponent;
