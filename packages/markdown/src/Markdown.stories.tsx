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
  initialValue:
    "# Heading\nLorem *ipsum **dolor** sit amet*\n\n1. Aaa\n   1. Bbb\n   2. Ccc\n   3. Ddd\n2. Eee",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};
