import { FluentEdit, FluentEditProps } from "@react-fluent-edit/core";
import { useState } from "react";
import createMarkdownPlugin from "./createMarkdownPlugin";

const plugins = [createMarkdownPlugin()];

const MarkdownStage = (props: FluentEditProps) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ minWidth: 500 }}>
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
      {value && (
        <div
          data-testid="fe-value"
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

export default MarkdownStage;
