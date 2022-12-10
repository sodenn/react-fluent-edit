import FluentEditCode from "./FluentEdit.code";
import FluentEditStory from "./FluentEdit.stage";

export default {
  title: "FluentEdit",
  component: FluentEditStory,
};

export const Basic = {
  args: {
    initialValue: "",
    placeholder: "Start typing",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: false,
    autoFocus: true,
    singleLine: false,
  },
  parameters: {
    docs: {
      source: {
        code: FluentEditCode,
        language: "typescript",
      },
    },
  },
};
