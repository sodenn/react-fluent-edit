import { Chip, Stack } from "@mui/joy";
import { ChipProps, FluentEditProps } from "@react-fluent-edit/core";
import { createDnDPlugin, Draggable } from "@react-fluent-edit/dnd";
import { Meta, StoryObj } from "@storybook/react";
import { forwardRef, useState } from "react";
import {
  defaultArgs,
  SbContainer,
  SbEditor,
  SbPreview,
  SbViewSource,
} from "./common";

const DraggableComp = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Chip
      ref={ref}
      {...props}
      style={{
        cursor: "move",
      }}
    />
  );
});

const ChipComp = forwardRef<HTMLSpanElement, ChipProps>(
  ({ style, attributes, color, ...props }, ref) => {
    return (
      <Chip
        component="span"
        size="sm"
        color="neutral"
        style={style}
        {...props}
        {...attributes}
      />
    );
  }
);

const plugins = [createDnDPlugin({ chipComponent: ChipComp })];

const Component = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <SbContainer>
      <Stack spacing={1} direction="row">
        <Draggable component={DraggableComp} value="{{Lorem ipsum}}" />
      </Stack>
      <SbEditor
        plugins={plugins}
        initialValue={value}
        onChange={setValue}
        //chipComponent={ChipComp}
        {...props}
      />
      <SbPreview>{value}</SbPreview>
      <SbViewSource src="DnD.stories.tsx" />
    </SbContainer>
  );
};

const meta = {
  title: "Examples/FluentEdit",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DnD: Story = {
  name: "DnD",
  args: { ...defaultArgs, initialValue: "{{Lorem}} ipsum dolor sit amet." },
  render: (props) => <Component {...props} />,
};
