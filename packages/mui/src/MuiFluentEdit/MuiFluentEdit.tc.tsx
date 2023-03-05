import { CssBaseline } from "@mui/material";
import { FluentEditProvider } from "@react-fluent-edit/core";
import { useState } from "react";
import MuiFluentEdit, { MuiFluentEditProps } from "../MuiFluentEdit";

const TestComponent = (props: MuiFluentEditProps) => {
  return (
    <FluentEditProvider>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = ({ initialValue, ...props }: MuiFluentEditProps) => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <CssBaseline />
      <MuiFluentEdit
        multiline={false}
        label="Description"
        placeholder="Start typing"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        initialValue={value}
        onChange={setValue}
        autoFocus
        {...props}
      />
      <div data-test-id="rfe-value">{value}</div>
    </>
  );
};

export default TestComponent;
