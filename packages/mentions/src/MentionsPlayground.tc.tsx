import {
  FluentEdit,
  FluentEditProps,
  FluentEditProvider,
  WithChildrenProp,
} from "@react-fluent-edit/core";
import { ChangeEvent, useMemo, useState } from "react";
import createMentionsPlugin from "./createMentionsPlugin";
import MentionsCombobox from "./MentionsCombobox";
import MentionsProvider from "./MentionsProvider";
import { Mention, MentionItem } from "./types";
import useMentions from "./useMentions";

interface WithOpenSection {
  openSections?: boolean;
}

interface SectionProps extends WithOpenSection, WithChildrenProp {
  title: string;
}

interface MentionsPlaygroundProps extends FluentEditProps, WithOpenSection {}

interface PluginConfigurationProps extends WithOpenSection {
  mentions: Mention[];
  onChange: (mentions: Mention[]) => void;
}

interface MentionToolbarProps extends WithOpenSection {
  triggers: string[];
}

interface MentionItemsProps extends WithOpenSection {
  triggers: string[];
  items: MentionItem[];
  onChange: (items: MentionItem[]) => void;
}

interface EditorProps extends FluentEditProps {
  items: MentionItem[];
}

const Section = ({ title, openSections, children }: SectionProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ minWidth: 450 }}>
      <h3
        style={{
          margin: "4px 0",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
        onClick={() => setOpen(!open)}
      >
        {title}
        <span>{open ? "⬆️" : "⬇️"}</span>
      </h3>
      {(open || openSections) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
};

const Fieldset = ({ children }: WithChildrenProp) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {children}
    </div>
  );
};

const List = ({ children }: WithChildrenProp) => {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{children}</ul>
  );
};

const ListItem = ({ children }: WithChildrenProp) => {
  return (
    <li
      style={{
        padding: "4px 0",
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      {children}
    </li>
  );
};

const PluginConfiguration = ({
  onChange,
  mentions,
  openSections,
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
    <Section openSections={openSections} title="Plugin Configuration">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Fieldset>
          <label htmlFor="trigger">Trigger</label>
          <input
            data-testid="fe-trigger"
            id="trigger"
            placeholder="e.g. @,#,+"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
        </Fieldset>
        <Fieldset>
          <label htmlFor="style">Style</label>
          <input
            id="style"
            data-testid="fe-style"
            placeholder={`{"color": "", "backgroundColor": ""}`}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </Fieldset>
        <button data-testid="fe-add-to-plugin" onClick={handleAddMention}>
          Add
        </button>
      </div>
      <List>
        {mentions.map((mention, index) => (
          <ListItem key={index}>
            <button
              data-testid={`fe-remove-${mention.trigger}-from-plugin`}
              disabled={mentions.length === 1}
              onClick={() => handleRemoveMention(index)}
            >
              🗑️
            </button>
            <span>
              <strong>Trigger:</strong> {mention.trigger}
            </span>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

const MentionItems = ({
  triggers,
  items,
  openSections,
  onChange,
}: MentionItemsProps) => {
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
    <Section openSections={openSections} title="Mention Items">
      <div style={{ gap: 8, display: "flex" }}>
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
          style={{ flex: 1 }}
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
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <button
              data-testid={`fe-remove-${item.trigger}-mention-item`}
              onClick={() => handleRemoveMentionItem(index)}
            >
              🗑️
            </button>
            <span>
              <strong>Trigger:</strong> {item.trigger}
            </span>
            <span>
              <strong>Text:</strong> {item.text}
            </span>
          </ListItem>
        ))}
      </List>
    </Section>
  );
};

const MentionToolbar = ({ triggers, openSections }: MentionToolbarProps) => {
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
    <Section openSections={openSections} title="Mentions Toolbar">
      <div>
        <select
          data-testid={`fe-trigger-select`}
          value={trigger}
          onChange={(e) => handelChangeTrigger(e.target.value)}
        >
          {triggers.map((t) => (
            <option key={t} value={t} data-testid={`fe-trigger-option-${t}`}>
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
    </Section>
  );
};

const Editor = ({ items, ...props }: EditorProps) => {
  const [editorValue, setEditorValue] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 8,
        gap: 8,
      }}
    >
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

const MentionsPlaygroundInternal = (props: MentionsPlaygroundProps) => {
  const { openSections } = props;

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
      <PluginConfiguration
        openSections={openSections}
        onChange={setMentions}
        mentions={mentions}
      />
      <MentionItems
        openSections={openSections}
        triggers={triggers}
        items={items}
        onChange={setItems}
      />
      <MentionToolbar openSections={openSections} triggers={triggers} />
      <Editor plugins={plugins} items={items} {...props} />
    </div>
  );
};

const MentionsPlayground = (props: MentionsPlaygroundProps) => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <MentionsPlaygroundInternal {...props} />
    </FluentEditProvider>
  );
};

const TestComponent = (props: MentionsPlaygroundProps) => {
  return <MentionsPlayground {...props} openSections />;
};

export { MentionsPlayground, TestComponent, MentionsPlaygroundProps };
