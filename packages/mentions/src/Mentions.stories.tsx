import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MentionsPlayground } from "./MentionsPlayground.tc";

export default {
  title: "FluentEdit",
  component: MentionsPlayground,
  argTypes: {
    autoCorrect: { control: "select", options: ["on", "off"] },
    autoCapitalize: { control: "select", options: ["on", "off"] },
  },
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof MentionsPlayground>;

const Template: ComponentStory<typeof MentionsPlayground> = (args) => (
  <MentionsPlayground {...args} />
);

export const Mentions = Template.bind({});
Mentions.args = {
  initialValue: "Hello @John",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};
