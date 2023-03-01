import { forwardRef } from "react";
import { ComboboxItemProps, ComboboxProps } from "./ComboboxProps";

const DefaultCombobox = forwardRef<HTMLUListElement, ComboboxProps>(
  ({ in: _in, ...props }, ref) => (
    <ul
      {...props}
      ref={ref}
      style={{
        cursor: "pointer",
        borderRadius: 4,
        backgroundColor: "rgb(255, 255, 255)",
        boxShadow:
          "rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px",
        listStyle: "none",
        padding: "4px 0",
        margin: 0,
      }}
    />
  )
);

const DefaultComboboxItem = forwardRef<HTMLLIElement, ComboboxItemProps>(
  ({ selected, ...props }, ref) => (
    <li
      {...props}
      ref={ref}
      style={{
        backgroundColor: selected
          ? "rgba(0, 0, 0, 0.04)"
          : "rgb(255, 255, 255)",
        padding: 8,
      }}
    />
  )
);

export { DefaultCombobox, DefaultComboboxItem };
