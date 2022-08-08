import {
  ClipboardEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { createEditor, Descendant, Transforms } from "slate";
import { withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  Slate,
  withReact,
} from "slate-react";
import ElementRenderer from "../ElementRenderer";
import LeafRenderer from "../LeafRenderer";
import useOverrides from "../overrides";
import Placeholder from "../Placeholder";
import PluginProvider from "../PluginProvider";
import { useDeserialize, useSerialize } from "../serialize";
import useEventHandler from "../useEventHandlerProps";
import useFluentEditInternal from "../useFluentEditInternal";
import {
  addRoot,
  focusEditor,
  isParagraph,
  removeRoot,
  withoutTab,
  withSingleLine,
} from "../utils";
import { FluentEditInternalProps, FluentEditProps } from "./FluentEditProps";

function createSlateEditor(singleLine: boolean) {
  let editor = withoutTab(withReact(withHistory(createEditor())));
  if (singleLine) {
    editor = withSingleLine(editor);
  }
  return editor;
}

const FluentEdit = (props: FluentEditProps) => {
  const { singleLine = false, markdown = false, plugins } = props;
  const [key, setKey] = useState(0);

  const { setEditor } = useFluentEditInternal();

  useEffect(() => setKey((v) => v + 1), [singleLine, JSON.stringify(plugins)]);

  return (
    <PluginProvider plugins={plugins}>
      <FluentEditInternal
        key={key}
        {...props}
        singleLine={singleLine}
        markdown={markdown}
        onCreateEditor={setEditor}
      />
    </PluginProvider>
  );
};

const FluentEditInternal = (props: FluentEditInternalProps) => {
  const {
    singleLine,
    markdown,
    autoFocus,
    placeholder,
    initialValue: initialTextValue = "",
    onChange,
    onCreateEditor,
    children,
    ...rest
  } = props;

  const overrides = useOverrides();

  const editor = useMemo(() => overrides(createSlateEditor(singleLine)), []);

  const { onPaste, onKeyDown, ...eventProps } = useEventHandler(editor);
  const serializer = useSerialize(markdown);
  const deserializer = useDeserialize(markdown);

  const renderElement = useCallback(
    (props: RenderElementProps) => <ElementRenderer {...props} />,
    []
  );

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <LeafRenderer {...props} />,
    []
  );

  const renderPlaceholder = useCallback((props: RenderPlaceholderProps) => {
    if (editor.children.length === 1 && isParagraph(editor.children[0])) {
      return <Placeholder {...props} />;
    } else {
      return <></>;
    }
  }, []);

  const initialValue = useMemo<Descendant[]>(
    () => addRoot(deserializer(initialTextValue, singleLine)),
    [serializer, initialTextValue, singleLine]
  );

  const handleEnterPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (singleLine) {
      event.preventDefault();
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "Enter":
          handleEnterPress(event);
          break;
      }
      onKeyDown?.(event);
    },
    [onKeyDown, handleEnterPress]
  );

  const handleChange = useCallback(() => {
    if (onChange) {
      const text = serializer(editor.children);
      onChange(text);
    }
  }, [onChange]);

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text");
      const nodes = removeRoot(deserializer(text, singleLine));
      Transforms.insertNodes(editor, nodes);
      Transforms.move(editor);

      const editorRef = ReactEditor.toDOMNode(editor, editor);
      const pasteEvent = new Event("fePaste");
      editorRef.dispatchEvent(pasteEvent);

      onPaste?.(event);
    },
    [singleLine, onPaste]
  );

  useLayoutEffect(() => {
    onCreateEditor(editor);
  }, []);

  useEffect(() => {
    if (autoFocus) {
      focusEditor(editor);
    }
  }, [autoFocus]);

  return (
    <Slate editor={editor} value={initialValue} onChange={handleChange}>
      <Editable
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        renderPlaceholder={renderPlaceholder}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        placeholder={placeholder}
        {...eventProps}
        {...rest}
        data-testid="fe"
      />
      {children}
    </Slate>
  );
};

export default FluentEdit;
