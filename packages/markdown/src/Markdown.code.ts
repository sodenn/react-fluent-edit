export default `
import { FluentEdit } from "@react-fluent-edit/core";
import { useState } from "react";
import createMarkdownPlugin from "./createMarkdownPlugin";

const plugins = [createMarkdownPlugin()];

const Story = () => {
  const [value, setValue] = useState("# Heading\\nLorem *ipsum **dolor** sit amet*\\n\\n1. Aaa\\n   1. Bbb\\n   2. Ccc\\n   3. Ddd\\n2. Eee");
  return (
    <div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit
          initialValue={value}
          onChange={setValue}
          plugins={plugins}
          autoFocus
          singleLine={false}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
      <div>
        {value}
      </div>
    </div>
  );
};

export default Story;
`;
