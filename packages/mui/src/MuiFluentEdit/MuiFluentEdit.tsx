import { styled, useTheme } from "@mui/material";
import {
  FluentEdit,
  FluentEditProps,
  useFluentEdit,
} from "@react-fluent-edit/core";
import { FocusEvent, ReactNode, useCallback, useState } from "react";
import { ReactEditor } from "slate-react";

const Legend = styled("legend")`
  user-select: none;
  margin-left: -5px;
  font-size: 12px;
  padding: 0 4px;
`;

const Fieldset = styled("fieldset")(({ theme }) => {
  const borderColor =
    theme.palette.mode === "light"
      ? "rgba(0, 0, 0, 0.23)"
      : "rgba(255, 255, 255, 0.23)";
  return {
    userSelect: "auto",
    margin: 0,
    borderRadius: theme.shape.borderRadius,
    borderWidth: 1,
    borderColor: borderColor,
    borderStyle: "solid",
    cursor: "text",
    "@media (hover: hover) and (pointer: fine)": {
      "&:hover": {
        borderColor: theme.palette.text.primary,
      },
    },
  };
});

interface MuiFluentEditProps extends FluentEditProps {
  label?: ReactNode;
}

const MuiFluentEdit = (props: MuiFluentEditProps) => {
  const { label, onFocus, onBlur } = props;
  const [focus, setFocus] = useState(false);
  const theme = useTheme();
  const fluentEdit = useFluentEdit();

  if (!fluentEdit) {
    console.warn(
      "Use a FluentEditProvider as the parent of MuiFluentEdit to enable the focus border styling."
    );
  }

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      setFocus(true);
      if (onFocus) {
        onFocus(event);
      }
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      setFocus(false);
      if (onBlur) {
        onBlur(event);
      }
    },
    [onBlur]
  );

  const handleClick = useCallback(() => {
    if (fluentEdit?.editor) {
      ReactEditor.focus(fluentEdit.editor);
    }
  }, [fluentEdit?.editor]);

  return (
    <Fieldset
      onClick={handleClick}
      style={
        focus
          ? {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              padding: "7px 13px 13px 14px",
            }
          : { padding: "7px 14px 14px 15px" }
      }
    >
      {label && (
        <Legend
          sx={{
            color: focus ? "primary.main" : "text.secondary",
          }}
        >
          {label}
        </Legend>
      )}
      <FluentEdit onFocus={handleFocus} onBlur={handleBlur} {...props} />
    </Fieldset>
  );
};

export default MuiFluentEdit;
