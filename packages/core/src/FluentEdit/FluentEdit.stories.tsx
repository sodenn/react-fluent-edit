import { ComponentMeta, ComponentStory } from "@storybook/react";
import FluentEditPlayground from "./FluentEditPlayground.tc";

export default {
  title: "FluentEdit",
  component: FluentEditPlayground,
  argTypes: {
    autoCorrect: { control: "select", options: ["on", "off"] },
    autoCapitalize: { control: "select", options: ["on", "off"] },
  },
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof FluentEditPlayground>;

const Template: ComponentStory<typeof FluentEditPlayground> = (args) => (
  <FluentEditPlayground {...args} />
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
