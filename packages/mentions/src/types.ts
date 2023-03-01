import { ChipComponent } from "@react-fluent-edit/core";
import { CSSProperties } from "react";

interface MentionItem {
  /**
   * The starting character of the mention (e.g. @).
   */
  trigger: string;
  /**
   * The mention without the starting character. This text must not contain spaces.
   */
  text: string;
}

interface Mention {
  /**
   * The starting character of the mention.
   */
  trigger: string;
  /**
   * The styling of the mention in the editor. The style prop is applied to the ChipComponent.
   */
  style?: CSSProperties;
}

interface MentionsPluginOptions {
  /**
   * Define the styling and the starting character of the mentions.
   */
  mentions: Mention[];
  /**
   * The ChipComponent for displaying the mentions in the editor.
   * @default
   */
  chipComponent?: ChipComponent;
  /**
   * If `true`, only mentions defined in the {@link MentionsCombobox} `items` prop are
   * allowed. This causes the "Add..." item in the combobox to be hidden.
   */
  disableCreatable?: boolean;
}

export { Mention, MentionsPluginOptions, MentionItem };
