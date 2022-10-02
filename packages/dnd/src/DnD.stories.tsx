import { ComponentMeta, ComponentStory } from "@storybook/react";
import FluentEdit from "./Dnd.tc";

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

export const Dnd = Template.bind({});
Dnd.args = {
  initialValue: "{{Lorem}} ipsum dolor sit amet.",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};
