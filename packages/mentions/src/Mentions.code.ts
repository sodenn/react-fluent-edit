export default `
import { 
  FluentEdit,
  FluentEditProvider
} from "@react-fluent-edit/core";
import { useMemo, useState } from "react";
import createMentionsPlugin from "./createMentionsPlugin";
import MentionsCombobox from "./MentionsCombobox";
import MentionsProvider from "./MentionsProvider";
import { Mention, MentionItem } from "./types";
import useMentions from "./useMentions";

const Editor = () => {
  const [value, setValue] = useState("Hello @John");

  const [mentions] = useState<Mention[]>([
    {
      trigger: "@",
      style: {
        color: "#17501b",
        backgroundColor: "#c8efcb",
      },
    },
    {
      trigger: "#",
      style: {
        color: "#213580",
        backgroundColor: "#dbe2ff",
      },
    },
  ]);

  const [items] = useState<MentionItem[]>([
    { text: "John", trigger: "@" },
    { text: "Jane", trigger: "@" },
  ]);

  const plugins = useMemo(
    () => [
      createMentionsPlugin({
        mentions,
      }),
    ],
    [mentions]
  );
  
  const { addMention, removeMentions, renameMentions, openMentionsCombobox } =
    useMentions();

  // ...

  return (
    <div>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit value={value} onChange={setValue} plugins={plugins}>
          <MentionsCombobox items={items} />
        </FluentEdit>
      </div>
      <div>{value}</div>
    </div>
  );
};

const Story = () => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <Editor />
    </FluentEditProvider>
  );
};

export default Story;
`;
