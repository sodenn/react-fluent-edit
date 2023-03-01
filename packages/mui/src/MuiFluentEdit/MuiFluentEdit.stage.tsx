import { CssBaseline } from "@mui/material";
import { FluentEditProvider } from "@react-fluent-edit/core";
import { useState } from "react";
import MuiFluentEdit, { MuiFluentEditProps } from "../MuiFluentEdit";

const MuiFluentEditStage = (props: MuiFluentEditProps) => {
  return (
    <FluentEditProvider>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = ({ initialValue, ...props }: MuiFluentEditProps) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ minWidth: 400 }}>
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
      {value && (
        <div
          data-test-id="rfe-value"
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

export default MuiFluentEditStage;
