import { FluentEdit, FluentEditProps } from "@react-fluent-edit/core";
import { useState } from "react";
import createMarkdownPlugin from "./createMarkdownPlugin";

const plugins = [createMarkdownPlugin()];

const TestComponent = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <>
      <FluentEdit
        autoFocus
        initialValue={value}
        onChange={setValue}
        plugins={plugins}
        {...props}
      />
      <div data-testid="rfe-value">{value}</div>
    </>
  );
};

export default TestComponent;
