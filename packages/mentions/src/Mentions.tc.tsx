import {
  FluentEdit,
  FluentEditProps,
  FluentEditProvider,
  useFluentEdit,
} from "@react-fluent-edit/core";
import { ChangeEvent, useMemo, useState } from "react";
import createMentionsPlugin from "./createMentionsPlugin";
import MentionsCombobox from "./MentionsCombobox";
import MentionsProvider from "./MentionsProvider";
import { Mention, MentionItem } from "./types";
import useMentions from "./useMentions";

interface PluginConfigurationProps {
  mentions: Mention[];
  disableCreatable: boolean;
  onChangeMentions: (mentions: Mention[]) => void;
  onChangeDisableCreatable: (disableCreatable: boolean) => void;
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
  onChangeMentions,
  onChangeDisableCreatable,
  mentions,
  disableCreatable,
}: PluginConfigurationProps) => {
  const [trigger, setTrigger] = useState("");
  const [style, setStyle] = useState("");

  const handleAddMention = () => {
    const styleObject = JSON.parse(style || "{}");
    const newMentions = [...mentions, { trigger, style: styleObject }];
    setTrigger("");
    setStyle("");
    onChangeMentions(newMentions);
  };

  const handleRemoveMention = (index: number) => {
    const newMentions = mentions.filter((_, i) => i !== index);
    onChangeMentions(newMentions);
  };

  const handleToggleDisableCreatable = () => {
    onChangeDisableCreatable(!disableCreatable);
  };

  return (
    <>
      <input
        data-testid="rfe-trigger"
        id="trigger"
        placeholder="e.g. @,#,+"
        value={trigger}
        onChange={(e) => setTrigger(e.target.value)}
      />
      <input
        id="style"
        data-testid="rfe-style"
        placeholder={`{"color": "", "backgroundColor": ""}`}
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      />
      <button data-testid="rfe-add-to-plugin" onClick={handleAddMention}>
        Add
      </button>
      <ul>
        {mentions.map((mention, index) => (
          <li key={index}>
            <button
              data-testid={`rfe-remove-${mention.trigger}-from-plugin`}
              disabled={mentions.length === 1}
              onClick={() => handleRemoveMention(index)}
            >
              Remove
            </button>
            <span>{mention.trigger}</span>
          </li>
        ))}
      </ul>
      <label htmlFor="disable-creatable">
        <input
          type="checkbox"
          id="disable-creatable"
          data-testid="rfe-disable-creatable"
          checked={disableCreatable}
          onChange={handleToggleDisableCreatable}
        />
        Disable Creatable
      </label>
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
      <select
        data-testid={`rfe-mention-item-trigger`}
        value={trigger}
        onChange={(e) => handelChangeTrigger(e.target.value)}
      >
        {triggers.map((t) => (
          <option
            key={t}
            value={t}
            data-testid={`rfe-trigger-option-${trigger}`}
          >
            {t}
          </option>
        ))}
      </select>
      <input
        data-testid="rfe-mention-item-text"
        onChange={(event) => setText(event.target.value)}
        value={text}
      />
      <button
        data-testid="rfe-add-mention-item"
        disabled={!text}
        onClick={handleAddMentionItem}
      >
        Add Mention
      </button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <button
              data-testid={`rfe-remove-${item.trigger}-mention-item`}
              onClick={() => handleRemoveMentionItem(index)}
            >
              Remove
            </button>
            {item.trigger}
            {item.text}
          </li>
        ))}
      </ul>
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
  const [value, setValue] = useState("");
  const { resetEditor } = useFluentEdit();
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

  const resetEditorValue = () => {
    resetEditor(value);
    setValue("");
  };

  return (
    <>
      <select
        data-testid={`rfe-trigger-select`}
        value={trigger}
        onChange={(e) => handelChangeTrigger(e.target.value)}
      >
        {triggers.map((t) => (
          <option key={t} value={t} data-testid={`rfe-trigger-option-${t}`}>
            {t}
          </option>
        ))}
      </select>
      <button
        data-testid="rfe-open-mentions"
        onClick={() => openMentionsCombobox(trigger)}
      >
        Open Mentions
      </button>
      <button
        data-testid="rfe-add-mention"
        disabled={!mentionToAdd}
        onClick={handleAddMention}
      >
        Add Mention
      </button>
      <input
        data-testid="rfe-mention-to-add"
        onChange={handleChangeMentionToAdd}
        value={mentionToAdd}
      />
      <button data-testid="rfe-remove-mention" onClick={handleRemoveMention}>
        Remove Mentions
      </button>
      <input
        data-testid="rfe-mention-to-remove"
        placeholder="Filter"
        onChange={handleChangeMentionToRemove}
        value={mentionToRemove}
      />
      <button
        data-testid="rfe-rename-mentions"
        disabled={!mentionToRenameNew}
        onClick={handleRenameMention}
      >
        Rename Mentions
      </button>
      <input
        data-testid="rfe-mention-to-rename-filter"
        placeholder="Filter"
        onChange={handleChangeMentionToRenameOld}
        value={mentionToRenameOld}
      />
      <input
        data-testid="rfe-mention-to-rename-value"
        onChange={handleChangeMentionToRenameNew}
        value={mentionToRenameNew}
      />
      <button data-testid="rfe-reset" onClick={resetEditorValue}>
        Reset input value
      </button>
      <input
        data-testid="rfe-reset-value"
        onChange={(ev) => setValue(ev.target.value)}
        value={value}
      />
    </>
  );
};

const Editor = ({ items, ...props }: EditorProps) => {
  const [editorValue, setEditorValue] = useState("");
  return (
    <>
      <FluentEdit {...props} onChange={setEditorValue}>
        <MentionsCombobox items={items} />
      </FluentEdit>
      <div data-testid="rfe-editor-value">{editorValue}</div>
    </>
  );
};

const MentionsPlaygroundInternal = (props: FluentEditProps) => {
  const [disableCreatable, setDisableCreatable] = useState(false);
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
        disableCreatable,
      }),
    ],
    [mentions, disableCreatable]
  );

  const triggers = useMemo(() => mentions.map((m) => m.trigger), [mentions]);

  return (
    <>
      <PluginConfiguration
        onChangeMentions={setMentions}
        onChangeDisableCreatable={setDisableCreatable}
        mentions={mentions}
        disableCreatable={disableCreatable}
      />
      <MentionItems triggers={triggers} items={items} onChange={setItems} />
      <MentionToolbar triggers={triggers} />
      <Editor plugins={plugins} items={items} {...props} />
    </>
  );
};

const TestComponent = (props: FluentEditProps) => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <MentionsPlaygroundInternal {...props} />
    </FluentEditProvider>
  );
};

export default TestComponent;
