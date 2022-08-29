import { ComponentMeta, ComponentStory } from "@storybook/react";
import MarkdownPlayground from "./MarkdownPlayground.tc";

export default {
  title: "FluentEdit",
  component: MarkdownPlayground,
  argTypes: {
    autoCorrect: { control: "select", options: ["on", "off"] },
    autoCapitalize: { control: "select", options: ["on", "off"] },
  },
  parameters: {
    layout: "centered",
  },
} as ComponentMeta<typeof MarkdownPlayground>;

const Template: ComponentStory<typeof MarkdownPlayground> = (args) => (
  <MarkdownPlayground {...args} />
);

export const Markdown = Template.bind({});
Markdown.args = {
  initialValue: "1. aaa\n   - bbb\n   - ccc\n      1. yyy\n2. ddd",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};
