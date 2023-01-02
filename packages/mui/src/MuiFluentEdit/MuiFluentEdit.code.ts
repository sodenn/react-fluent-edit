export default `
import { CssBaseline } from "@mui/material";
import { FluentEditProvider } from "@react-fluent-edit/core";
import {
  createMentionsPlugin,
  MentionCombobox,
  MentionsProvider,
} from "@react-fluent-edit/mentions";
import { MuiFluentEdit } from "@react-fluent-edit/mui";
import { useState } from "react";

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

const Story = () => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = () => {
  const [value, setValue] = useState("Hello @Jane");
  return (
    <div>
      <CssBaseline />
      <MuiFluentEdit
        label="Description"
        placeholder="Start typing"
        initialValue={value}
        onChange={setValue}
        plugins={[plugin]}
        singleLine
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus
      >
        <MentionCombobox
          items={[
            { text: "John", trigger: "@" },
            { text: "Jane", trigger: "@" },
          ]}
        />
      </MuiFluentEdit>
      <div>
        {value}
      </div>
    </div>
  );
};

export default Story;
`;
