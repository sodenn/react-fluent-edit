import { Combobox, ComboboxItem } from "@react-fluent-edit/core";
import {
  ComboboxCloseEvents,
  ComboboxCloseReason,
} from "@react-fluent-edit/core/src/Combobox/ComboboxProps";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { Mention } from "../types";
import useMentionsInternal from "../useMentionsInternal";
import {
  addMentionNodes,
  getMentionNodes,
  getUserInputAtSelection,
  insertMention,
  useMentionPlugin,
} from "../utils";
import { MentionComboboxProps } from "./MentionsComboboxProps";

const MentionsCombobox: FC<MentionComboboxProps> = (props) => {
  const { renderAddMentionLabel, items = [] } = props;
  const [comboboxElement, setComboboxElement] = useState<any | null>(null);
  const [target, setTarget] = useState<Range | null>(null);
  const [search, setSearch] = useState("");
  const [mention, setMention] = useState<Mention | null>(null);
  const plugin = useMentionPlugin();
  const editor = useSlateStatic();
  const mentionsContext = useMentionsInternal();
  const mentions = plugin ? [...plugin.options.mentions] : [];
  const suggestions = useMemo((): string[] => {
    const list =
      items
        .filter(
          (i) =>
            i.trigger === mention?.trigger &&
            i.text.toLowerCase().startsWith(search.toLowerCase())
        )
        .map((i) => i.text) || [];
    if (!!search && list.every((i) => i !== search)) {
      list.push(search);
    }
    const itemsFromEditor = getMentionNodes(editor)
      .filter(([n]) => n.trigger === mention?.trigger)
      .map(([n]) => n.value)
      .filter((i) => !list.includes(i));
    return list.concat(itemsFromEditor);
  }, [JSON.stringify(mentions), search, mention]);
  const showAddMenuItem =
    !!search &&
    items?.find((m) => m.trigger === mention?.trigger)?.text !== search;
  const open = !!target && (suggestions.length > 0 || search.length > 0);

  const closeCombobox = useCallback(() => {
    setTarget(null);
    setMention(null);
  }, []);

  const openCombobox = () => {
    const result = getUserInputAtSelection(editor, mentions);
    if (result) {
      setTarget(result.target);
      setSearch(result.search);
      setMention(result.mention);
    } else {
      closeCombobox();
    }
  };

  const handleClose = (
    event: ComboboxCloseEvents,
    reason: ComboboxCloseReason,
    index: number
  ) => {
    if (!target || !mention) {
      return;
    }

    if (reason === "escapePress" || reason === "clickAway") {
      closeCombobox();
      return;
    }

    if (reason === "enterPress") {
      event.preventDefault();
      event.stopPropagation();
    }

    const value =
      reason === "enterPress" || reason === "tabPress"
        ? index < suggestions.length
          ? suggestions[index]
          : search
        : reason === "spacePress"
        ? search.trim()
        : undefined;

    if (!value) {
      return;
    }

    insertMention({ editor, value, target, ...mention });
    closeCombobox();
  };

  const handleBlur = (event: FocusEvent) => {
    if (comboboxElement?.contains(event.relatedTarget)) {
      return;
    }
    const result = getUserInputAtSelection(editor, mentions);
    if (result && result.search) {
      const { mention, search, target } = result;
      insertMention({ editor, value: search, target, ...mention });
    }
  };

  const handlePaste = () => {
    setTimeout(() => addMentionNodes(editor, mentions), 0);
  };

  const handleClickSuggestion = (index?: number) => {
    if (target && mention) {
      const value =
        typeof index !== "undefined" && index < suggestions.length
          ? suggestions[index]
          : search;
      insertMention({ editor, value, target, ...mention });
      closeCombobox();
      ReactEditor.focus(editor);
    }
  };

  useEffect(openCombobox, [editor.children]);

  useEffect(
    () => mentionsContext?.setMentions(mentions),
    [JSON.stringify(mentions)]
  );

  useEffect(() => {
    const editorRef = ReactEditor.toDOMNode(editor, editor);
    editorRef.addEventListener("blur", handleBlur);
    editorRef.addEventListener("click", openCombobox);
    editorRef.addEventListener("fePaste", handlePaste);
    return () => {
      editorRef.removeEventListener("blur", handleBlur);
      editorRef.removeEventListener("click", openCombobox);
      editorRef.removeEventListener("fePaste", handlePaste);
    };
  }, [suggestions, comboboxElement]);

  return (
    <Combobox
      open={open}
      onClose={handleClose}
      ref={setComboboxElement}
      range={target}
    >
      {suggestions.map((char, i) => (
        <ComboboxItem
          data-testid={`rfe-mention-combobox-item-${char}`}
          onClick={() =>
            handleClickSuggestion(
              showAddMenuItem && char === search ? undefined : i
            )
          }
          key={char}
        >
          {showAddMenuItem &&
            char === search &&
            renderAddMentionLabel &&
            renderAddMentionLabel(search)}
          {showAddMenuItem &&
            char === search &&
            !renderAddMentionLabel &&
            `Add "${search}"`}
          {(!showAddMenuItem || char !== search) && char}
        </ComboboxItem>
      ))}
    </Combobox>
  );
};

MentionsCombobox.displayName = "mentions";

export default MentionsCombobox;
