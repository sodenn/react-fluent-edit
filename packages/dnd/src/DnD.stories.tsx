import { ComponentMeta, ComponentStory } from "@storybook/react";
import DnDCode from "./DnD.code";
import DnDStory from "./Dnd.stage";

export default {
  title: "FluentEdit",
  component: DnDStory,
} as ComponentMeta<typeof DnDStory>;

const Template: ComponentStory<typeof DnDStory> = (args) => (
  <DnDStory {...args} />
);

export const DnD = Template.bind({});
DnD.args = {
  initialValue: "{{Lorem}} ipsum dolor sit amet.",
  placeholder: "Start typing",
  autoCorrect: "off",
  autoCapitalize: "off",
  spellCheck: false,
  autoFocus: true,
  singleLine: false,
};
DnD.storyName = "DnD";

DnD.parameters = {
  docs: {
    source: { code: DnDCode },
    language: "typescript",
  },
};
