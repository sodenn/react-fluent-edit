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
}

export { Mention, MentionsPluginOptions, MentionItem };
