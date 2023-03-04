import { Box, Button } from "@mui/joy";
import { ReactNode } from "react";

interface SbViewSourceProps {
  src: string;
  children?: ReactNode;
}

const storybookSrc = `https://github.com/sodenn/react-fluent-edit/blob/${
  // @ts-ignore
  import.meta.env.STORYBOOK_BRANCH_NAME
}/packages/storybook/src/`;

function getBaseUrl(src: string) {
  return `${storybookSrc}${src}`;
}

const SbViewSource = ({ src, children }: SbViewSourceProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        size="sm"
        component="a"
        href={getBaseUrl(src)}
        target="_blank"
      >
        {children ?? "View on GitHub"}
      </Button>
    </Box>
  );
};

export { SbViewSource };
