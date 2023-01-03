import { Fade, MenuItem, MenuList, Paper } from "@mui/material";
import {
  ComboboxComponent,
  ComboboxItemComponent,
} from "@react-fluent-edit/core";
import { forwardRef } from "react";

const MuiCombobox = forwardRef<HTMLUListElement, ComboboxComponent>(
  (props, ref) => (
    <Fade in={props.in}>
      <Paper elevation={2}>
        <MenuList ref={ref}>{props.children}</MenuList>
      </Paper>
    </Fade>
  )
);

const MuiComboboxItem = forwardRef<HTMLLIElement, ComboboxItemComponent>(
  (props, ref) => {
    return <MenuItem {...props} />;
  }
);

export default MuiCombobox;
export { MuiComboboxItem };
