import { ComponentMeta, ComponentStory } from "@storybook/react";
import MarkdownCode from "./Markdown.code";
import MarkdownStory from "./Markdown.stage";

export default {
  title: "FluentEdit",
  component: MarkdownStory,
} as ComponentMeta<typeof MarkdownStory>;

const Template: ComponentStory<typeof MarkdownStory> = (args) => (
  <MarkdownStory {...args} />
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

Markdown.parameters = {
  docs: {
    source: { code: MarkdownCode },
    language: "typescript",
  },
};
