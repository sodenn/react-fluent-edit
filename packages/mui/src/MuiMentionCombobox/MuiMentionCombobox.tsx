import {Fade, MenuItem, MenuItemProps, MenuList, Paper, useTheme} from "@mui/material";
import { WithChildrenProp } from "@react-fluent-edit/core";
import {
  MentionCombobox,
  MentionComboboxProps,
} from "@react-fluent-edit/mentions";
import { forwardRef } from "react";

const ListComponent = forwardRef<HTMLDivElement, WithChildrenProp>(
  ({ children }, ref) => (
    <div ref={ref}>
      <Fade in>
        <Paper elevation={2}>
          <MenuList>{children}</MenuList>
        </Paper>
      </Fade>
    </div>
  )
);

const ListItemComponent = (props: MenuItemProps) => {
  return (
    <MenuItem
      {...props}
      onMouseDown={(e) => {
        e.preventDefault(); // keep focus in text field
      }}
    ></MenuItem>
  );
};

const MuiMentionCombobox = (props: Pick<MentionComboboxProps, "items" | "renderAddMentionLabel">) => {
  const theme = useTheme();
  return (
    <MentionCombobox
      zIndex={theme.zIndex.modal + 1}
      ListComponent={ListComponent}
      ListItemComponent={ListItemComponent}
      {...props}
    />
  )
};

export default MuiMentionCombobox;
