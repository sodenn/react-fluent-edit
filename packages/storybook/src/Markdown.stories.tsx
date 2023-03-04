import { FluentEditProps } from "@react-fluent-edit/core";
import createMarkdownPlugin from "@react-fluent-edit/markdown/src/createMarkdownPlugin";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  defaultArgs,
  SbContainer,
  SbEditor,
  SbPreview,
  SbViewSource,
} from "./common";

const plugins = [createMarkdownPlugin()];

const Component = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <SbContainer>
      <SbEditor
        plugins={plugins}
        initialValue={value}
        onChange={setValue}
        {...props}
      />
      <SbPreview>{value}</SbPreview>
      <SbViewSource src="Markdown.stories.tsx" />
    </SbContainer>
  );
};

const meta = {
  title: "Examples/FluentEdit",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Markdown: Story = {
  name: "Markdown",
  args: {
    ...defaultArgs,
    initialValue:
      "# Heading\nLorem *ipsum **dolor** sit amet*\n\n1. Aaa\n   1. Bbb\n   2. Ccc\n   3. Ddd\n2. Eee",
  },
  render: (props) => <Component {...props} />,
};
