import { CssBaseline } from "@mui/material";
import { FluentEditProps, FluentEditProvider } from "@react-fluent-edit/core";
import {
  createMentionsPlugin,
  MentionsProvider,
} from "@react-fluent-edit/mentions";
import { ComponentMeta, ComponentStory } from "@storybook/react";
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

const FluentEditStory = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ padding: 8, width: 400 }}>
      <CssBaseline />
      <MuiFluentEdit {...props} plugins={[plugin]} onChange={setValue}>
        <MuiMentionCombobox
          items={[
            { text: "John", trigger: "@" },
            { text: "Jane", trigger: "@" },
          ]}
        />
      </MuiFluentEdit>
      {value && (
        <div
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

export default {
  title: "FluentEdit",
  component: FluentEditStory,
  argTypes: {
    autoCorrect: { control: "select", options: ["on", "off"] },
    autoCapitalize: { control: "select", options: ["on", "off"] },
  },
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof FluentEditStory>;

const Template: ComponentStory<typeof FluentEditStory> = (args) => (
  <FluentEditProvider providers={[<MentionsProvider />]}>
    <FluentEditStory {...args} />
  </FluentEditProvider>
);

export const MUI = Template.bind({});
MUI.args = {
  initialValue: "Hello @John",
  label: "Description",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};
