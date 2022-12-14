import { CssBaseline } from "@mui/material";
import { FluentEditProvider } from "@react-fluent-edit/core";
import {
  createMentionsPlugin,
  MentionCombobox,
  MentionsProvider,
} from "@react-fluent-edit/mentions";
import { useState } from "react";
import MuiFluentEdit, { MuiFluentEditProps } from "../MuiFluentEdit";

const plugin = createMentionsPlugin({
  mentions: [
    {
      trigger: "@",
      style: {
        color: "#17501b",
        backgroundColor: "#c8efcb",
      },
    },
  ],
});

const MuiFluentEditStage = (props: MuiFluentEditProps) => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = (props: MuiFluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ minWidth: 400 }}>
      <CssBaseline />
      <MuiFluentEdit
        multiline={false}
        plugins={[plugin]}
        label="Description"
        placeholder="Start typing"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        initialValue="Hello @Jane"
        onChange={setValue}
        autoFocus
        {...props}
      >
        <MentionCombobox
          items={[
            { text: "John", trigger: "@" },
            { text: "Jane", trigger: "@" },
          ]}
        />
      </MuiFluentEdit>
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
