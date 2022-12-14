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
}

export { Mention, MentionsPluginOptions, MentionItem };
