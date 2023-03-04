import { Box } from "@mui/joy";
import { FluentEdit, FluentEditProps } from "@react-fluent-edit/core";

const SbEditor = (props: FluentEditProps) => {
  return (
    <Box
      sx={{
        fontFamily: "Roboto",
        border: "2px solid #096bde",
        borderRadius: 4,
        p: 1,
      }}
    >
      <FluentEdit
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        initialValue=""
        autoFocus
        {...props}
      />
    </Box>
  );
};

export { SbEditor };
