import { WithChildrenProp } from "@react-fluent-edit/core";
import {
  CSSProperties,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
} from "react";
import { BaseRange, Editor } from "slate";

interface MentionComboboxItemProps extends WithChildrenProp {
  onClick: () => void;
  selected: boolean;
}

interface MentionItem {
  trigger: string;
  text: string;
}

interface FindMentionsOptions {
  trigger: string;
  text?: string;
}

interface Mention {
  trigger: string;
  style?: CSSProperties;
}

interface RenameMentionsOptions extends FindMentionsOptions {
  newText: string;
}

interface InsertMentionOptions extends Omit<Mention, "suggestions"> {
  editor: Editor;
  value: string;
  target: BaseRange;
}

interface InsertSpaceOperation {
  operation: "insert-space";
  direction: "before" | "after" | "both";
}

interface InsertNodeOperation {
  operation: "insert-node";
}

type InsertOperation = InsertSpaceOperation | InsertNodeOperation;

interface MentionsContext {
  setMentions: Dispatch<SetStateAction<Mention[]>>;
  addMention: (opt: MentionItem) => void;
  hasMentions: (opt: FindMentionsOptions) => boolean;
  renameMentions: (opt: RenameMentionsOptions) => void;
  removeMentions: (opt: FindMentionsOptions) => void;
  openMentionsCombobox: (trigger: string) => void;
}

interface MentionComboboxProps {
  items?: MentionItem[];
  zIndex?: number;
  ListComponent?: FunctionComponent;
  ListItemComponent?: FunctionComponent<MentionComboboxItemProps>;
  renderAddMentionLabel?: (value: string) => ReactNode;
}

interface MentionsPluginOptions {
  mentions: Mention[];
}

export {
  MentionComboboxItemProps,
  Mention,
  RenameMentionsOptions,
  InsertMentionOptions,
  InsertSpaceOperation,
  InsertNodeOperation,
  InsertOperation,
  MentionComboboxProps,
  MentionsPluginOptions,
  MentionItem,
  MentionsContext,
  FindMentionsOptions,
};
