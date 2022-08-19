import { FluentEdit, FluentEditProps } from "@react-fluent-edit/core";
import { useState } from "react";
import createMarkdownPlugin from "./createMarkdownPlugin";

const plugins = [createMarkdownPlugin()];

const MarkdownPlayground = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ maxWidth: 400 }}>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          initialValue=""
          autoFocus
          onChange={setValue}
          plugins={plugins}
          {...props}
        />
      </div>
      <div data-testid="fe-value">{value}</div>
    </div>
  );
};

export default MarkdownPlayground;
