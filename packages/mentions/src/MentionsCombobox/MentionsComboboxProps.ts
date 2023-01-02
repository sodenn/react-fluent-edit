import { WithChildrenProp } from "@react-fluent-edit/core";
import { ReactNode } from "react";
import { MentionItem } from "../types";

interface MentionComboboxItemProps extends WithChildrenProp {
  onClick: () => void;
  selected: boolean;
}

interface MentionComboboxProps {
  items?: MentionItem[];
  renderAddMentionLabel?: (value: string) => ReactNode;
}

export type { MentionComboboxItemProps, MentionComboboxProps };
