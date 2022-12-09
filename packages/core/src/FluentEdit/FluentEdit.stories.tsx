import { ComponentMeta, ComponentStory } from "@storybook/react";
import FluentEditCode from "./FluentEdit.code";
import FluentEditStory from "./FluentEdit.stage";

export default {
  title: "FluentEdit",
  component: FluentEditStory,
} as ComponentMeta<typeof FluentEditStory>;

const Template: ComponentStory<typeof FluentEditStory> = (args) => (
  <FluentEditStory {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  initialValue: "",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  autoFocusPosition: "end",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};

Basic.parameters = {
  docs: {
    source: { code: FluentEditCode },
    language: "typescript",
  },
};
