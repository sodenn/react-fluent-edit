import { WithChildrenProp } from "@react-fluent-edit/core";
import { FunctionComponent, ReactNode } from "react";
import { MentionItem } from "../types";

interface MentionComboboxItemProps extends WithChildrenProp {
  onClick: () => void;
  selected: boolean;
}

interface MentionComboboxProps {
  items?: MentionItem[];
  zIndex?: number;
  ListComponent?: FunctionComponent;
  ListItemComponent?: FunctionComponent<MentionComboboxItemProps>;
  renderAddMentionLabel?: (value: string) => ReactNode;
}

export type { MentionComboboxItemProps, MentionComboboxProps };
