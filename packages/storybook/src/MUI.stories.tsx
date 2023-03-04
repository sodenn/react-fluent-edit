import { CssBaseline } from "@mui/material";
import { FluentEditProvider } from "@react-fluent-edit/core";
import { MuiFluentEdit, MuiFluentEditProps } from "@react-fluent-edit/mui";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { defaultArgs } from "./common";

const Component = (props: MuiFluentEditProps) => {
  return (
    <FluentEditProvider>
      <Editor {...props} />
    </FluentEditProvider>
  );
};

const Editor = ({ initialValue, ...props }: MuiFluentEditProps) => {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ minWidth: 400 }}>
      <CssBaseline />
      <MuiFluentEdit
        multiline={false}
        label="Description"
        placeholder="Start typing"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        initialValue={value}
        onChange={setValue}
        autoFocus
        {...props}
      />
      {value && (
        <div
          data-test-id="rfe-value"
          style={{
            padding: 8,
            borderRadius: 4,
            marginTop: 12,
            whiteSpace: "pre-wrap",
            backgroundColor: "#efefef",
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

const meta = {
  title: "Examples/MuiFluentEdit",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: { ...defaultArgs, initialValue: "Hello", label: "Description" },
  render: (props) => <Component {...props} />,
};
