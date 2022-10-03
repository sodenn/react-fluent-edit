import { ComponentMeta, ComponentStory } from "@storybook/react";
import MuiFluentEditCode from "./MuiFluentEdit.code";
import MuiFluentEditStory from "./MuiFluentEdit.stage";

export default {
  title: "FluentEdit",
  component: MuiFluentEditStory,
} as ComponentMeta<typeof MuiFluentEditStory>;

const Template: ComponentStory<typeof MuiFluentEditStory> = (args) => (
  <MuiFluentEditStory {...args} />
);

export const MUI = Template.bind({});
MUI.args = {
  initialValue: "Hello @Jane",
  label: "Description",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};

MUI.parameters = {
  docs: {
    source: { code: MuiFluentEditCode },
    language: "typescript",
  },
};
