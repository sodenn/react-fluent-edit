import MuiFluentEditCode from "./MuiFluentEdit.code";
import MuiFluentEditStory from "./MuiFluentEdit.stage";

export default {
  title: "FluentEdit",
  component: MuiFluentEditStory,
};

export const MUI = {
  args: {
    initialValue: "Hello",
    label: "Description",
    placeholder: "Start typing",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: false,
    autoFocus: true,
    multiline: false,
  },
  parameters: {
    docs: {
      source: {
        code: MuiFluentEditCode,
        language: "typescript",
      },
    },
  },
};
