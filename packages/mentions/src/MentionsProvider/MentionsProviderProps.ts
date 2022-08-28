import { Dispatch, SetStateAction } from "react";
import { Mention, MentionItem } from "../types";

interface FindMentionsOptions {
  trigger: string;
  text?: string;
}

interface RenameMentionsOptions extends FindMentionsOptions {
  newText: string;
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

export {
  FindMentionsOptions,
  RenameMentionsOptions,
  InsertOperation,
  MentionsContext,
};
