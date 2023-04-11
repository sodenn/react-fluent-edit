import { Button, Stack } from "@mui/joy";
import {
  FluentEditProps,
  FluentEditProvider,
  useFluentEdit,
} from "@react-fluent-edit/core";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  SbContainer,
  SbEditor,
  SbPreview,
  SbViewSource,
  defaultArgs,
} from "./common";

const Component = (props: FluentEditProps) => {
  return (
    <FluentEditProvider>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = (props: FluentEditProps) => {
  const { focusEditor, resetEditor } = useFluentEdit();
  const [value, setValue] = useState("");
  return (
    <SbContainer>
      <Stack spacing={1} direction="row">
        <Button data-testid="rfe-focus" onClick={focusEditor}>
          Focus
        </Button>
        <Button data-testid="rfe-reset" onClick={() => resetEditor()}>
          Reset
        </Button>
      </Stack>
      <SbEditor onChange={setValue} {...props} />
      <SbPreview>{value}</SbPreview>
      <SbViewSource src="Basic.stories.tsx" />
    </SbContainer>
  );
};

const meta = {
  title: "Examples/FluentEdit",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: defaultArgs,
  render: (props) => <Component {...props} />,
  parameters: {
    sourceLink: "https://github.com/Sirrine-Jonathan/storybook-source-link/",
  },
};
