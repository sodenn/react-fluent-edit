import { ComponentMeta, ComponentStory } from "@storybook/react";
import MentionsCode from "./Mentions.code";
import MentionsStory from "./Mentions.stage";

export default {
  title: "FluentEdit",
  component: MentionsStory,
} as ComponentMeta<typeof MentionsStory>;

const Template: ComponentStory<typeof MentionsStory> = (args) => (
  <MentionsStory {...args} />
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

Mentions.parameters = {
  docs: {
    source: { code: MentionsCode },
    language: "typescript",
  },
};
