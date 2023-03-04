import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  Option,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy";
import {
  FluentEditProps,
  FluentEditProvider,
  useFluentEdit,
  WithChildrenProp,
} from "@react-fluent-edit/core";
import {
  createMentionsPlugin,
  Mention,
  MentionCombobox,
  MentionItem,
  MentionsProvider,
  useMentions,
} from "@react-fluent-edit/mentions";
import { Meta, StoryObj } from "@storybook/react";
import { ChangeEvent, Fragment, useMemo, useState } from "react";
import { defaultArgs, SbContainer, SbEditor, SbPreview } from "./common";

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

const TabContent = ({ children }: WithChildrenProp) => {
  return (
    <Card variant="outlined" sx={{ boxShadow: "none", gap: 1 }}>
      {children}
    </Card>
  );
};

const PluginConfiguration = ({
  onChangeMentions,
  onChangeDisableCreatable,
  mentions,
  disableCreatable,
}: PluginConfigurationProps) => {
  const defaultStyle = JSON.stringify({ backgroundColor: "" });
  const [trigger, setTrigger] = useState("");
  const [style, setStyle] = useState(defaultStyle);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const handleAddMention = () => {
    const styleObject = JSON.parse(style || "{}");
    if (typeof selectedIndex === "number") {
      const newMentions = mentions.map((item, idx) =>
        idx === selectedIndex ? { trigger, style: styleObject } : item
      );
      onChangeMentions(newMentions);
    } else {
      onChangeMentions([...mentions, { trigger, style: styleObject }]);
    }
    setTrigger("");
    setStyle("");
    setSelectedIndex(undefined);
  };

  const handleRemoveMention = (index: number) => {
    const newMentions = mentions.filter((_, i) => i !== index);
    onChangeMentions(newMentions);
  };

  const handleToggleDisableCreatable = () => {
    onChangeDisableCreatable(!disableCreatable);
  };

  const handleSelectItem = (index: number) => {
    const mention = mentions.at(index);
    setSelectedIndex(selectedIndex !== index ? index : undefined);
    if (mention) {
      setTrigger(selectedIndex !== index ? mention.trigger : "");
      setStyle(
        selectedIndex !== index ? JSON.stringify(mention.style) : defaultStyle
      );
    }
  };

  return (
    <TabContent>
      <Checkbox
        label="Disable Creatable"
        data-testid="rfe-disable-creatable"
        checked={disableCreatable}
        onChange={handleToggleDisableCreatable}
      />
      <Box
        sx={{ display: "flex", gap: 1, alignItems: "flex-end", width: "100%" }}
      >
        <FormControl sx={{ width: 120 }}>
          <FormLabel htmlFor="trigger">Trigger</FormLabel>
          <Input
            data-testid="rfe-trigger"
            id="trigger"
            placeholder="e.g. @,#,+"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ width: "100%" }}>
          <FormLabel htmlFor="style">Style</FormLabel>
          <Input
            id="style"
            data-testid="rfe-style"
            placeholder={`{"color": "", "backgroundColor": ""}`}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
        </FormControl>
        <div>
          <Button data-testid="rfe-add-to-plugin" onClick={handleAddMention}>
            {typeof selectedIndex === "number" ? "Replace" : "Add"}
          </Button>
        </div>
      </Box>
      <List variant="outlined" sx={{ borderRadius: "sm" }}>
        {mentions.map((mention, index) => (
          <Fragment key={index}>
            <ListItem
              startAction={
                <IconButton
                  data-testid={`rfe-remove-${mention.trigger}-from-plugin`}
                  disabled={mentions.length === 1}
                  onClick={() => handleRemoveMention(index)}
                  size="sm"
                  variant="plain"
                  color="neutral"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                selected={index === selectedIndex}
                variant={index === selectedIndex ? "soft" : "plain"}
                color={index === selectedIndex ? "neutral" : undefined}
                onClick={() => handleSelectItem(index)}
              >
                <Chip
                  color="neutral"
                  size="sm"
                  sx={{ ...mention.style, px: 2 }}
                >
                  {mention.trigger}
                </Chip>
              </ListItemButton>
            </ListItem>
            {index + 1 < mentions.length && <ListDivider />}
          </Fragment>
        ))}
      </List>
    </TabContent>
  );
};

const MentionItems = ({ triggers, items, onChange }: MentionItemsProps) => {
  const [text, setText] = useState("");
  const [trigger, setTrigger] = useState<string>(
    triggers.length > 0 ? triggers[0] : ""
  );
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const handelChangeTrigger = (t: string) => {
    setTrigger(t);
  };

  const handleAddMentionItem = () => {
    if (typeof selectedIndex === "number") {
      const newItems = items.map((item, idx) =>
        idx === selectedIndex ? { trigger, text } : item
      );
      onChange(newItems);
    } else {
      onChange([...items, { trigger, text }]);
    }
    setText("");
    setSelectedIndex(undefined);
  };

  const handleRemoveMentionItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleSelectItem = (index: number) => {
    const item = items.at(index);
    setSelectedIndex(selectedIndex !== index ? index : undefined);
    if (item) {
      setTrigger(item.trigger);
      setText(selectedIndex !== index ? item.text : "");
    }
  };

  return (
    <TabContent>
      <Stack spacing={1} direction="row">
        <Select
          sx={{ width: 100 }}
          data-testid={`rfe-mention-item-trigger`}
          value={trigger}
          onChange={(_, value) => handelChangeTrigger(value as string)}
        >
          {triggers.map((t) => (
            <Option
              key={t}
              value={t}
              data-testid={`rfe-trigger-option-${trigger}`}
            >
              {t}
            </Option>
          ))}
        </Select>
        <Input
          fullWidth
          data-testid="rfe-mention-item-text"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <Button
          data-testid="rfe-add-mention-item"
          disabled={!text}
          onClick={handleAddMentionItem}
        >
          {typeof selectedIndex === "number" ? "Replace" : "Add"}
        </Button>
      </Stack>
      <List variant="outlined" sx={{ borderRadius: "sm" }}>
        {items.map((item, index) => (
          <Fragment key={index}>
            <ListItem
              startAction={
                <IconButton
                  data-testid={`rfe-remove-${item.trigger}-mention-item`}
                  onClick={() => handleRemoveMentionItem(index)}
                  size="sm"
                  variant="plain"
                  color="neutral"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                selected={index === selectedIndex}
                variant={index === selectedIndex ? "soft" : "plain"}
                color={index === selectedIndex ? "neutral" : undefined}
                onClick={() => handleSelectItem(index)}
              >
                {item.trigger}
                {item.text}
              </ListItemButton>
            </ListItem>
            {index + 1 < items.length && <ListDivider />}
          </Fragment>
        ))}
      </List>
    </TabContent>
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
    <TabContent>
      <Grid container spacing={1} sx={{ maxWidth: 450 }}>
        <Grid xs={12}>
          <Select
            data-testid={`rfe-trigger-select`}
            value={trigger}
            onChange={(_, value) => handelChangeTrigger(value as string)}
          >
            {triggers.map((t) => (
              <Option key={t} value={t} data-testid={`rfe-trigger-option-${t}`}>
                {t}
              </Option>
            ))}
          </Select>
        </Grid>
        <Grid xs={12}>
          <Button
            fullWidth
            data-testid="rfe-open-mentions"
            onClick={() => openMentionsCombobox(trigger)}
          >
            Open Mentions
          </Button>
        </Grid>
        <Grid xs={4}>
          <Button
            fullWidth
            data-testid="rfe-add-mention"
            disabled={!mentionToAdd}
            onClick={handleAddMention}
          >
            Add Mention
          </Button>
        </Grid>
        <Grid xs={8}>
          <Input
            data-testid="rfe-mention-to-add"
            onChange={handleChangeMentionToAdd}
            value={mentionToAdd}
          />
        </Grid>
        <Grid xs={4}>
          <Button
            fullWidth
            data-testid="rfe-remove-mention"
            onClick={handleRemoveMention}
          >
            Remove Mentions
          </Button>
        </Grid>
        <Grid xs={8}>
          <Input
            data-testid="rfe-mention-to-remove"
            placeholder="Filter"
            onChange={handleChangeMentionToRemove}
            value={mentionToRemove}
          />
        </Grid>
        <Grid xs={4}>
          <Button
            fullWidth
            data-testid="rfe-rename-mentions"
            disabled={!mentionToRenameNew}
            onClick={handleRenameMention}
          >
            Rename Mentions
          </Button>
        </Grid>
        <Grid xs={4}>
          <Input
            data-testid="rfe-mention-to-rename-filter"
            placeholder="Filter"
            onChange={handleChangeMentionToRenameOld}
            value={mentionToRenameOld}
          />
        </Grid>
        <Grid xs={4}>
          <Input
            data-testid="rfe-mention-to-rename-value"
            onChange={handleChangeMentionToRenameNew}
            value={mentionToRenameNew}
          />
        </Grid>
        <Grid xs={4}>
          <Button fullWidth data-testid="rfe-reset" onClick={resetEditorValue}>
            Reset input value
          </Button>
        </Grid>
        <Grid xs={8}>
          <Input
            data-testid="rfe-reset-value"
            onChange={(ev) => setValue(ev.target.value)}
            value={value}
          />
        </Grid>
      </Grid>
    </TabContent>
  );
};

const Editor = ({ items, ...props }: EditorProps) => {
  const [editorValue, setEditorValue] = useState("");
  return (
    <SbContainer>
      <SbEditor {...props} onChange={setEditorValue}>
        <MentionCombobox items={items} />
      </SbEditor>
      <SbPreview>{editorValue}</SbPreview>
    </SbContainer>
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
    <Stack spacing={1} direction="column">
      <Tabs defaultValue={0}>
        <TabList>
          <Tab>Configuration</Tab>
          <Tab>Items</Tab>
          <Tab>Actions</Tab>
        </TabList>
        <TabPanel value={0}>
          <PluginConfiguration
            onChangeMentions={setMentions}
            onChangeDisableCreatable={setDisableCreatable}
            mentions={mentions}
            disableCreatable={disableCreatable}
          />
        </TabPanel>
        <TabPanel value={1}>
          <MentionItems triggers={triggers} items={items} onChange={setItems} />
        </TabPanel>
        <TabPanel value={2}>
          <MentionToolbar triggers={triggers} />
        </TabPanel>
      </Tabs>
      <Editor plugins={plugins} items={items} {...props} />
    </Stack>
  );
};

const Component = (props: FluentEditProps) => {
  return (
    <FluentEditProvider providers={[<MentionsProvider />]}>
      <MentionsPlaygroundInternal {...props} />
    </FluentEditProvider>
  );
};

const meta = {
  title: "Examples/FluentEdit",
  component: Component,
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mentions: Story = {
  name: "Mentions",
  args: {
    ...defaultArgs,
    initialValue: "Hello @John",
  },
  render: (props) => <Component {...props} />,
};
