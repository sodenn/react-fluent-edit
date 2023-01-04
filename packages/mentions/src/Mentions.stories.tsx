import MentionsCode from "./Mentions.code";
import MentionsStory from "./Mentions.stage";

export default {
  title: "FluentEdit",
  component: MentionsStory,
};

export const Mentions = {
  args: {
    initialValue: "Hello @John",
    placeholder: "Start typing",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: false,
    autoFocus: true,
    multiline: true,
  },
  parameters: {
    docs: {
      source: {
        code: MentionsCode,
        language: "typescript",
      },
    },
  },
};
