import { Alert } from "@mui/joy";
import { WithChildrenProp } from "@react-fluent-edit/core";
import React, { useMemo } from "react";

const SbPreview = ({ children }: WithChildrenProp) => {
  const isEmpty = useMemo(() => {
    const arr = React.Children.map(children, (child) => child === "");
    return arr?.length === 1 && arr[0] === true;
  }, [children]);

  if (isEmpty) {
    return null;
  }

  return (
    <Alert sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
      {children}
    </Alert>
  );
};

export { SbPreview };
