import {
  ClipboardEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Descendant, Transforms } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
  Slate,
} from "slate-react";
import useDecorate from "../decorate";
import ElementRenderer from "../ElementRenderer";
import LeafRenderer from "../LeafRenderer";
import useOverrides from "../overrides";
import Placeholder from "../Placeholder";
import PluginProvider from "../PluginProvider";
import { useDeserialize, useSerialize } from "../serialize";
import useEventHandler from "../useEventHandler";
import useFluentEditInternal from "../useFluentEditInternal";
import { addRoot, focusEditor, isParagraph, removeRoot } from "../utils";
import createSlateEditor from "./createSlateEditor";
import { FluentEditInternalProps, FluentEditProps } from "./FluentEditProps";

const FluentEdit = (props: FluentEditProps) => {
  const { singleLine = false, plugins } = props;
  const [key, setKey] = useState(0);

  const ctx = useFluentEditInternal();

  useEffect(() => setKey((v) => v + 1), [singleLine, JSON.stringify(plugins)]);

  return (
    <PluginProvider plugins={plugins}>
      <FluentEditInternal
        key={key}
        {...props}
        singleLine={singleLine}
        onCreateEditor={ctx?.setEditor}
      />
    </PluginProvider>
  );
};

const FluentEditInternal = (props: FluentEditInternalProps) => {
  const {
    singleLine,
    autoFocus,
    placeholder,
    initialValue: initialTextValue = "",
    onChange,
    onCreateEditor,
    children,
    plugins = [],
    ...rest
  } = props;

  const overrides = useOverrides();

  const editor = useMemo(() => overrides(createSlateEditor(singleLine)), []);

  const { onPaste, onKeyDown, ...eventProps } = useEventHandler(editor);
  const serializer = useSerialize();
  const deserializer = useDeserialize();
  const decorate = useDecorate(editor);

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

  const pluginOptions = useMemo(
    () =>
      plugins.reduce((prev, curr) => {
        prev[curr.name] = curr.options;
        return prev;
      }, {}),
    [plugins]
  );

  const initialValue = useMemo<Descendant[]>(
    () => addRoot(deserializer(initialTextValue, singleLine, pluginOptions)),
    [serializer, initialTextValue, singleLine, pluginOptions]
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
      const nodes = removeRoot(deserializer(text, singleLine, pluginOptions));
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
    onCreateEditor?.(editor);
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
        decorate={decorate}
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
