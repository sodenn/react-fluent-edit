import { Button, Stack } from "@mui/joy";
import {
  FluentEditProps,
  FluentEditProvider,
  useFluentEdit,
} from "@react-fluent-edit/core";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { defaultArgs, SbContainer, SbEditor, SbPreview } from "./common";

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
  name: "Basic",
  args: defaultArgs,
  render: (props) => <Component {...props} />,
};
