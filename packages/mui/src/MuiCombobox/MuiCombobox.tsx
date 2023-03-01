import { Fade, MenuItem, MenuList, Paper } from "@mui/material";
import { ComboboxItemProps, ComboboxProps } from "@react-fluent-edit/core";
import { forwardRef } from "react";

const MuiCombobox = forwardRef<HTMLUListElement, ComboboxProps>(
  (props, ref) => {
    const { in: inProp, children, ...other } = props;
    return (
      <Fade in={inProp}>
        <Paper elevation={2}>
          <MenuList ref={ref} {...other}>
            {children}
          </MenuList>
        </Paper>
      </Fade>
    );
  }
);

const MuiComboboxItem = forwardRef<HTMLLIElement, ComboboxItemProps>(
  (props, ref) => {
    return <MenuItem {...props} />;
  }
);

export default MuiCombobox;
export { MuiComboboxItem };
