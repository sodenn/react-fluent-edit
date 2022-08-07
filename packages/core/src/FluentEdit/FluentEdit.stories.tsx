import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import FluentEditProvider from "../FluentEditProvider";
import useFluentEdit from "../useFluentEdit";
import FluentEdit from "./FluentEdit";
import { FluentEditProps } from "./FluentEditProps";

const FluentEditStory = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  const { focusEditor } = useFluentEdit();
  return (
    <div style={{ minWidth: 500 }}>
      <div style={{ marginBottom: 8 }}>
        <button onClick={focusEditor}>Focus</button>
      </div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit {...props} onChange={setValue} />
      </div>
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
  <FluentEditProvider>
    <FluentEditStory {...args} />
  </FluentEditProvider>
);

export const Simple = Template.bind({});
Simple.args = {
  initialValue: "",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
  markdown: false,
};
