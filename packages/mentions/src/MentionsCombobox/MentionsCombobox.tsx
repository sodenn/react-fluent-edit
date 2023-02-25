import {
  Combobox,
  ComboboxCloseEvents,
  ComboboxCloseReason,
  ComboboxItem,
  editorToDomNode,
} from "@react-fluent-edit/core";
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
  const disableCreatable = plugin.options.disableCreatable;
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
    if (disableCreatable !== true) {
      if (!!search && list.every((i) => i !== search)) {
        list.push(search);
      }
      const itemsFromEditor = getMentionNodes(editor)
        .filter(([n]) => n.trigger === mention?.trigger)
        .map(([n]) => n.value)
        .filter((i) => !list.includes(i));
      return list.concat(itemsFromEditor);
    } else {
      return list;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, mention, disableCreatable, ...mentions]);
  const showAddMenuItem =
    disableCreatable !== true &&
    !!search &&
    items?.find((m) => m.trigger === mention?.trigger)?.text !== search;
  const open = !!target && (suggestions.length > 0 || search.length > 0);

  const closeCombobox = useCallback(() => {
    setTarget(null);
    setMention(null);
  }, []);

  const openCombobox = useCallback(() => {
    const result = getUserInputAtSelection(editor, mentions);
    if (result) {
      setTarget(result.target);
      setSearch(result.search);
      setMention(result.mention);
    } else {
      closeCombobox();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeCombobox, editor, ...mentions]);

  const handleClose = useCallback(
    (
      event: ComboboxCloseEvents,
      reason: ComboboxCloseReason,
      index?: number
    ) => {
      if (!target || !mention) {
        return;
      }

      if (reason === "escapePress") {
        closeCombobox();
        return;
      }

      if (reason === "clickAway") {
        return;
      }

      if (reason === "enterPress") {
        event.preventDefault();
        event.stopPropagation();
      }

      if (typeof index === "undefined") {
        return;
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      closeCombobox,
      editor,
      search,
      suggestions,
      target,
      ...mentions, // eslint-disable-line react-hooks/exhaustive-deps
    ]
  );

  const handleBlur = useCallback(
    (event: FocusEvent) => {
      if (comboboxElement?.contains(event.relatedTarget)) {
        return;
      }
      const result = getUserInputAtSelection(editor, mentions);
      if (result && result.search) {
        if (
          disableCreatable === true &&
          items.filter(
            (i) =>
              i.text === result.search && i.trigger === result.mention.trigger
          )
        ) {
          // mention cannot be inserted if it's not in `items`
          return;
        }
        const { mention, search, target } = result;
        insertMention({ editor, value: search, target, ...mention });
      }
      closeCombobox();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      comboboxElement,
      editor,
      closeCombobox,
      disableCreatable,
      items,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...mentions,
    ]
  );

  const handlePaste = useCallback(() => {
    setTimeout(() => addMentionNodes(editor, mentions), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, ...mentions]);

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

  useEffect(openCombobox, [editor.children, openCombobox]);

  useEffect(
    () => mentionsContext?.setMentions(mentions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...mentions]
  );

  useEffect(() => {
    const editorElem = editorToDomNode(editor);
    editorElem?.addEventListener("blur", handleBlur);
    editorElem?.addEventListener("click", openCombobox);
    editorElem?.addEventListener("fePaste", handlePaste);
    return () => {
      editorElem?.removeEventListener("blur", handleBlur);
      editorElem?.removeEventListener("click", openCombobox);
      editorElem?.removeEventListener("fePaste", handlePaste);
    };
  }, [suggestions, editor, handleBlur, openCombobox, handlePaste]);

  return (
    <Combobox
      open={open}
      onClose={handleClose}
      ref={setComboboxElement}
      range={target}
      data-testid="rfe-mention-combobox"
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

MentionsCombobox.displayName = "MentionsCombobox";

export default MentionsCombobox;
