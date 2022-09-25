import { ComponentMeta, ComponentStory } from "@storybook/react";
import FluentEdit from "./FluentEdit.tc";

export default {
  title: "FluentEdit",
  component: FluentEdit,
  argTypes: {
    autoCorrect: { control: "select", options: ["on", "off"] },
    autoCapitalize: { control: "select", options: ["on", "off"] },
  },
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof FluentEdit>;

const Template: ComponentStory<typeof FluentEdit> = (args) => (
  <FluentEdit {...args} />
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
};
