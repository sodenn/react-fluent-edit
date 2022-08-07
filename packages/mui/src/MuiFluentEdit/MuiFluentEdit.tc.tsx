import { FluentEditProps, FluentEditProvider } from "@react-fluent-edit/core";
import {
  createMentionsPlugin,
  MentionsProvider,
} from "@react-fluent-edit/mentions";
import { useState } from "react";
import MuiFluentEdit from "../MuiFluentEdit";
import MuiMentionCombobox from "../MuiMentionCombobox";

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

const TestComponent = (props: FluentEditProps) => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <Internal {...props} />
    </FluentEditProvider>
  );
};

const Internal = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 400 }}>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <MuiFluentEdit
          singleLine
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
          <MuiMentionCombobox
            items={[
              { text: "John", trigger: "@" },
              { text: "Jane", trigger: "@" },
            ]}
          />
        </MuiFluentEdit>
      </div>
      <div data-test-id="fe-value">{value}</div>
    </div>
  );
};

export default TestComponent;
