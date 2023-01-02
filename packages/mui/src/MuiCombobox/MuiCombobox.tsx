import { Fade, MenuItem, MenuList, Paper } from "@mui/material";
import { ComboboxItemProps, WithChildrenProp } from "@react-fluent-edit/core";
import { forwardRef } from "react";

const MuiCombobox = forwardRef<HTMLUListElement, WithChildrenProp>(
  ({ children }, ref) => (
    <Fade in>
      <Paper elevation={2}>
        <MenuList ref={ref}>{children}</MenuList>
      </Paper>
    </Fade>
  )
);

const MuiComboboxItem = forwardRef<HTMLLIElement, ComboboxItemProps>(
  (props, ref) => {
    return (
      <MenuItem
        {...props}
        onMouseDown={(e) => {
          e.preventDefault(); // keep focus in text field
        }}
      />
    );
  }
);

export default MuiCombobox;
export { MuiComboboxItem };
