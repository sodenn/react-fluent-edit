import { ChipComponent } from "@react-fluent-edit/core";
import { CSSProperties } from "react";

interface MentionItem {
  trigger: string;
  text: string;
}

interface Mention {
  trigger: string;
  style?: CSSProperties;
}

interface MentionsPluginOptions {
  mentions: Mention[];
  chipComponent?: ChipComponent;
  /**
   * If `true`, only mentions defined in the {@link MentionsCombobox} `items` prop are
   * allowed. This causes the "Add..." item in the combobox to be hidden.
   */
  disableCreatable?: boolean;
}

export { Mention, MentionsPluginOptions, MentionItem };
