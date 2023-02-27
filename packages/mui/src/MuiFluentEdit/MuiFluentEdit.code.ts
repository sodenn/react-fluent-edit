export default `
import { CssBaseline } from "@mui/material";
import { MuiFluentEdit } from "@react-fluent-edit/mui";
import { useState } from "react";

const Story = () => {
  const [value, setValue] = useState("Hello");
  return (
    <div>
      <CssBaseline />
      <MuiFluentEdit
        label="Description"
        placeholder="Start typing"
        initialValue={value}
        onChange={setValue}
        multiline={false}
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus
      />
      <div>
        {value}
      </div>
    </div>
  );
};

export default Story;
`;
