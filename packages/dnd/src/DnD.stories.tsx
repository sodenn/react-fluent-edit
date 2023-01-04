import DnDCode from "./DnD.code";
import DnDStory from "./Dnd.stage";

export default {
  title: "FluentEdit",
  component: DnDStory,
};

export const DnD = {
  name: "DnD",
  args: {
    initialValue: "{{Lorem}} ipsum dolor sit amet.",
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
        code: DnDCode,
        language: "typescript",
      },
    },
  },
};
