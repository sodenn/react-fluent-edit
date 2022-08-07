import {
  FluentEdit,
  FluentEditProps,
  FluentEditProvider,
} from "@react-fluent-edit/core";
import { ChangeEvent, useMemo, useState } from "react";
import createMentionsPlugin from "./createMentionsPlugin";
import MentionsCombobox from "./MentionsCombobox";
import MentionsProvider from "./MentionsProvider";
import { Mention, MentionItem } from "./types";
import useMentions from "./useMentions";

interface PluginConfigurationProps {
  mentions: Mention[];
  onChange: (mentions: Mention[]) => void;
}

interface MentionToolbarProps {
  triggers: string[];
}

interface MentionItemsProps {
  triggers: string[];
  items: MentionItem[];
  onChange: (items: MentionItem[]) => void;
}

interface EditorProps extends FluentEditProps {
  items: MentionItem[];
}

const PluginConfiguration = ({
  onChange,
  mentions,
}: PluginConfigurationProps) => {
  const [trigger, setTrigger] = useState("");
  const [style, setStyle] = useState("");

  const handleAddMention = () => {
    const styleObject = JSON.parse(style || "{}");
    const newMentions = [...mentions, { trigger, style: styleObject }];
    setTrigger("");
    setStyle("");
    onChange(newMentions);
  };

  const handleRemoveMention = (index: number) => {
    const newMentions = mentions.filter((_, i) => i !== index);
    onChange(newMentions);
  };

  return (
    <>
      <h3 style={{ margin: 0 }}>Plugin Configuration</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="trigger">Trigger</label>
            <input
              data-testid="fe-trigger"
              id="trigger"
              placeholder="e.g. @,#,+"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="style">Style</label>
            <input
              id="style"
              data-testid="fe-style"
              placeholder={`{"color": "", "backgroundColor": ""}`}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>
          <button data-testid="fe-add-to-plugin" onClick={handleAddMention}>
            Add
          </button>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {mentions.map((mention, index) => (
            <li style={{ padding: "4px 0" }} key={index}>
              <button
                data-testid={`fe-remove-${mention.trigger}-to-plugin`}
                disabled={mentions.length === 1}
                onClick={() => handleRemoveMention(index)}
              >
                🗑️
              </button>
              <span style={{ marginLeft: 8 }}>
                <strong>Trigger:</strong> {mention.trigger}
              </span>
              <span style={{ marginLeft: 8 }}>
                <strong>Style:</strong>{" "}
                <code>{JSON.stringify(mention.style)}</code>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const MentionToolbar = ({ triggers }: MentionToolbarProps) => {
  const [trigger, setTrigger] = useState<string>(
    triggers.length > 0 ? triggers[0] : ""
  );
  const [mentionToAdd, setMentionToAdd] = useState("");
  const [mentionToRemove, setMentionToRemove] = useState("");
  const [mentionToRenameOld, setMentionToRenameOld] = useState("");
  const [mentionToRenameNew, setMentionToRenameNew] = useState("");

  const { addMention, removeMentions, renameMentions, openMentionsCombobox } =
    useMentions();

  const handleChangeMentionToAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setMentionToAdd(value);
    }
  };

  const handleAddMention = () => {
    addMention({ text: mentionToAdd, trigger });
    setMentionToAdd("");
  };

  const handleChangeMentionToRemove = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setMentionToRemove(value);
    }
  };

  const handleRemoveMention = () => {
    removeMentions({ text: mentionToRemove, trigger });
    setMentionToRemove("");
  };

  const handleChangeMentionToRenameOld = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setMentionToRenameOld(value);
    }
  };

  const handleChangeMentionToRenameNew = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setMentionToRenameNew(value);
    }
  };

  const handleRenameMention = () => {
    renameMentions({
      trigger,
      text: mentionToRenameOld,
      newText: mentionToRenameNew,
    });
    setMentionToRenameOld("");
    setMentionToRenameNew("");
  };

  const handelChangeTrigger = (t: string) => {
    setTrigger(t);
  };

  return (
    <>
      <h3 style={{ margin: 0 }}>Mentions Toolbar</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div>
          <select
            data-testid={`fe-trigger-select`}
            value={trigger}
            onChange={(e) => handelChangeTrigger(e.target.value)}
          >
            {triggers.map((t) => (
              <option
                key={t}
                value={t}
                data-testid={`fe-trigger-option-${trigger}`}
              >
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            data-testid="fe-open-mentions"
            onClick={() => openMentionsCombobox(trigger)}
          >
            Open Mentions
          </button>
        </div>
        <div style={{ gap: 4, display: "flex" }}>
          <button
            data-testid="fe-add-mention"
            disabled={!mentionToAdd}
            onClick={handleAddMention}
          >
            Add Mention
          </button>
          <input
            data-testid="fe-mention-to-add"
            onChange={handleChangeMentionToAdd}
            value={mentionToAdd}
          />
        </div>
        <div style={{ gap: 4, display: "flex" }}>
          <button data-testid="fe-remove-mention" onClick={handleRemoveMention}>
            Remove Mentions
          </button>
          <input
            data-testid="fe-mention-to-remove"
            placeholder="Filter or remove all"
            onChange={handleChangeMentionToRemove}
            value={mentionToRemove}
          />
        </div>
        <div style={{ gap: 4, display: "flex" }}>
          <button
            data-testid="fe-rename-mentions"
            disabled={!mentionToRenameNew}
            onClick={handleRenameMention}
          >
            Rename Mentions
          </button>
          <input
            data-testid="fe-mention-to-rename-filter"
            placeholder="Filter or rename all"
            onChange={handleChangeMentionToRenameOld}
            value={mentionToRenameOld}
          />
          <input
            data-testid="fe-mention-to-rename-value"
            onChange={handleChangeMentionToRenameNew}
            value={mentionToRenameNew}
          />
        </div>
      </div>
    </>
  );
};

const MentionItems = ({ triggers, items, onChange }: MentionItemsProps) => {
  const [text, setText] = useState("");
  const [trigger, setTrigger] = useState<string>(
    triggers.length > 0 ? triggers[0] : ""
  );

  const handelChangeTrigger = (t: string) => {
    setTrigger(t);
  };

  const handleAddMentionItem = () => {
    onChange([...items, { trigger, text }]);
    setTrigger("");
    setText("");
  };

  const handleRemoveMentionItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <h3 style={{ margin: 0 }}>Mention Items</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ gap: 4, display: "flex" }}>
          <select
            data-testid={`fe-mention-item-trigger`}
            value={trigger}
            onChange={(e) => handelChangeTrigger(e.target.value)}
          >
            {triggers.map((t) => (
              <option
                key={t}
                value={t}
                data-testid={`fe-trigger-option-${trigger}`}
              >
                {t}
              </option>
            ))}
          </select>
          <input
            data-testid="fe-mention-item-text"
            onChange={(event) => setText(event.target.value)}
            value={text}
          />
          <button
            data-testid="fe-add-mention-item"
            disabled={!text}
            onClick={handleAddMentionItem}
          >
            Add Mention
          </button>
        </div>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, index) => (
          <li style={{ padding: "4px 0" }} key={index}>
            <button
              data-testid={`fe-remove-${item.trigger}-mention-item`}
              onClick={() => handleRemoveMentionItem(index)}
            >
              🗑️
            </button>
            <span style={{ marginLeft: 8 }}>
              <strong>Trigger:</strong> {item.trigger}
            </span>
            <span style={{ marginLeft: 8 }}>
              <strong>Text:</strong> {item.text}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

const Editor = ({ items, ...props }: EditorProps) => {
  const [editorValue, setEditorValue] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <h3 style={{ margin: 0 }}>Editor</h3>
      <div style={{ border: "1px solid #aaa", borderRadius: 4, padding: 8 }}>
        <FluentEdit {...props} onChange={setEditorValue}>
          <MentionsCombobox items={items} />
        </FluentEdit>
      </div>
      {editorValue && (
        <div
          data-testid="fe-editor-value"
          style={{
            padding: 8,
            borderRadius: 4,
            whiteSpace: "pre-wrap",
            backgroundColor: "#efefef",
          }}
        >
          {editorValue}
        </div>
      )}
    </div>
  );
};

const MentionsPlaygroundInternal = (props: FluentEditProps) => {
  const [mentions, setMentions] = useState<Mention[]>([
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

  const [items, setItems] = useState<MentionItem[]>([
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

  const triggers = useMemo(() => mentions.map((m) => m.trigger), [mentions]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <PluginConfiguration onChange={setMentions} mentions={mentions} />
      <MentionItems triggers={triggers} items={items} onChange={setItems} />
      <MentionToolbar triggers={triggers} />
      <Editor plugins={plugins} items={items} {...props} />
    </div>
  );
};

const MentionsPlayground = (props: FluentEditProps) => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <MentionsPlaygroundInternal {...props} />
    </FluentEditProvider>
  );
};

export default MentionsPlayground;
