import { WithChildrenProp } from "@react-fluent-edit/core";
import {
  FC,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Range } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import ClickAwayListener from "../ClickAwayListener";
import {
  Mention,
  MentionComboboxItemProps,
  MentionComboboxProps,
} from "../types";
import useMentionsInternal from "../useMentionsInternal";
import {
  addMentionNodes,
  getMentionNodes,
  getUserInputAtSelection,
  insertMention,
  setSuggestionComboboxPosition,
  useMentionPlugins,
} from "../utils";

const Portal = ({ children }: WithChildrenProp) => {
  return typeof document === "object"
    ? createPortal(children, document.body)
    : null;
};

const DefaultListComponent = forwardRef<HTMLUListElement, WithChildrenProp>(
  ({ children }, ref) => (
    <ul
      ref={ref}
      style={{
        backgroundColor: "#eee",
        listStyle: "none",
        padding: 0,
        margin: "0 12px",
      }}
    >
      {children}
    </ul>
  )
);

const DefaultListItemComponent = (props: MentionComboboxItemProps) => (
  <li
    {...props}
    style={{ backgroundColor: props.selected ? "#ddd" : "#eee", padding: 4 }}
  />
);

const MentionsCombobox: FC<MentionComboboxProps> = (props) => {
  const {
    renderAddMentionLabel,
    items = [],
    zIndex: zIndex,
    ListComponent = DefaultListComponent,
    ListItemComponent = DefaultListItemComponent,
  } = props;
  const [popoverElement, setPopoverElement] = useState<HTMLDivElement | null>(
    null
  );
  const [target, setTarget] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [mention, setMention] = useState<Mention | null>(null);
  const plugins = useMentionPlugins();
  const mentions = plugins.flatMap((p) => p.options.mentions);
  const editor = useSlateStatic();
  const mentionsContext = useMentionsInternal();

  const showAddMenuItem =
    !!search &&
    items?.find((m) => m.trigger === mention?.trigger)?.text !== search;

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
      .map(([n]) => n.value)
      .filter((i) => !list.includes(i));
    return list.concat(itemsFromEditor);
  }, [JSON.stringify(mentions), search, mention]);

  const closeCombobox = useCallback(() => {
    setTarget(null);
    setMention(null);
    setIndex(0);
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

  const handleArrowDownPress = (event: KeyboardEvent) => {
    if (target) {
      event.preventDefault();
      const prevIndex = index >= suggestions.length - 1 ? 0 : index + 1;
      setIndex(prevIndex);
    }
  };

  const handleArrowUpPress = (event: KeyboardEvent) => {
    if (target) {
      event.preventDefault();
      const nextIndex = index <= 0 ? suggestions.length - 1 : index - 1;
      setIndex(nextIndex);
      return true;
    }
    return false;
  };

  const handleTabPress = () => {
    if (target && mention) {
      const value = index < suggestions.length ? suggestions[index] : search;
      insertMention({ editor, value, target, ...mention });
      closeCombobox();
    }
  };

  const handleEnterPress = (event: KeyboardEvent) => {
    if (target && mention) {
      event.preventDefault();
      event.stopPropagation();
      const value = index < suggestions.length ? suggestions[index] : search;
      insertMention({ editor, value, target, ...mention });
      closeCombobox();
    }
  };

  const handleEscapePress = (event: KeyboardEvent) => {
    if (target && mention) {
      event.preventDefault();
      event.stopPropagation();
      closeCombobox();
    }
  };

  const handleSpacePress = () => {
    const value = search.trim();
    if (target && mention && value) {
      insertMention({ editor, value, target, ...mention });
      closeCombobox();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        handleArrowDownPress(event);
        break;
      case "ArrowUp":
        handleArrowUpPress(event);
        break;
      case "Tab":
        handleTabPress();
        break;
      case "Enter":
        handleEnterPress(event);
        break;
      case "Escape":
        handleEscapePress(event);
        break;
      case " ":
        handleSpacePress();
        break;
    }
  };

  const handleBlur = (event: FocusEvent) => {
    // @ts-ignore
    if (popoverElement?.contains(event.relatedTarget)) {
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

  useEffect(() => {
    if (
      target &&
      popoverElement &&
      (suggestions.length > 0 || search.length > 0)
    ) {
      setSuggestionComboboxPosition(editor, popoverElement, target);
    }
  }, [suggestions.length, search, target, popoverElement]);

  useEffect(() => {
    if (mentionsContext) {
      mentionsContext.setMentions(mentions);
    }
  }, [JSON.stringify(mentions)]);

  useEffect(() => {
    const editorRef = ReactEditor.toDOMNode(editor, editor);
    editorRef.addEventListener("blur", handleBlur);
    editorRef.addEventListener("click", openCombobox);
    editorRef.addEventListener("keydown", handleKeyDown);
    editorRef.addEventListener("fePaste", handlePaste);
    return () => {
      editorRef.removeEventListener("blur", handleBlur);
      editorRef.removeEventListener("click", openCombobox);
      editorRef.removeEventListener("keydown", handleKeyDown);
      editorRef.removeEventListener("fePaste", handlePaste);
    };
  }, [suggestions, index, popoverElement]);

  if (target && (suggestions.length > 0 || search.length > 0)) {
    return (
      <Portal>
        <div
          ref={setPopoverElement}
          style={{
            top: "-9999px",
            left: "-9999px",
            position: "absolute",
            zIndex,
          }}
          data-testid="fe-mention-combobox"
        >
          <ClickAwayListener onClickAway={closeCombobox}>
            <ListComponent>
              {suggestions.map((char, i) => (
                <ListItemComponent
                  data-testid={`fe-mention-combobox-item-${char}`}
                  onClick={() =>
                    showAddMenuItem && char === search
                      ? handleClickSuggestion()
                      : handleClickSuggestion(i)
                  }
                  key={char}
                  selected={i === index}
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
                </ListItemComponent>
              ))}
            </ListComponent>
          </ClickAwayListener>
        </div>
      </Portal>
    );
  }

  return null;
};

MentionsCombobox.displayName = "mentions";

export default MentionsCombobox;
