import { ReactNode } from "react";
import { MentionItem } from "../types";

interface MentionComboboxProps {
  items?: MentionItem[];
  renderAddMentionLabel?: (value: string) => ReactNode;
}

export type { MentionComboboxProps };
