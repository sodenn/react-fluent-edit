import { Box, CssBaseline, CssVarsProvider, Stack } from "@mui/joy";
import { WithChildrenProp } from "@react-fluent-edit/core";

const SbContainer = ({ children }: WithChildrenProp) => {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ minWidth: { xs: "80vw", sm: 400 } }}>
        <Stack spacing={1}>{children}</Stack>
      </Box>
    </CssVarsProvider>
  );
};

export { SbContainer };
