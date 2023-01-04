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
import ComponentProvider from "../ComponentProvider";
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
import { getPluginOptions } from "../utils/plugin-utils";
import createSlateEditor from "./createSlateEditor";
import { FluentEditInternalProps, FluentEditProps } from "./FluentEditProps";

const FluentEdit = ({
  chipComponent,
  comboboxComponent,
  comboboxRootStyle,
  comboboxItemComponent,
  ...props
}: FluentEditProps) => {
  const { singleLine = false, plugins } = props;
  const [key, setKey] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setKey((v) => v + 1), [singleLine, JSON.stringify(plugins)]);

  return (
    <ComponentProvider
      chipComponent={chipComponent}
      comboboxComponent={comboboxComponent}
      comboboxRootStyle={comboboxRootStyle}
      comboboxItemComponent={comboboxItemComponent}
    >
      <PluginProvider plugins={plugins}>
        <FluentEditInternal key={key} {...props} singleLine={singleLine} />
      </PluginProvider>
    </ComponentProvider>
  );
};

const FluentEditInternal = (props: FluentEditInternalProps) => {
  const {
    singleLine,
    autoFocus,
    placeholder,
    initialValue: initialTextValue = "",
    onChange,
    children,
    plugins = [],
    ...rest
  } = props;

  const overrides = useOverrides();
  const ctx = useFluentEditInternal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editor = useMemo(() => overrides(createSlateEditor(singleLine)), []);
  const { onPaste, onKeyDown, ...eventProps } = useEventHandler(editor);
  const serializer = useSerialize(plugins);
  const deserializer = useDeserialize(plugins);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pluginOptions = useMemo(() => getPluginOptions(plugins), [plugins]);

  const initialValue = useMemo<Descendant[]>(
    () => addRoot(deserializer(initialTextValue, singleLine, pluginOptions)),
    [deserializer, initialTextValue, singleLine, pluginOptions]
  );

  const handleEnterPress = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (singleLine) {
        event.preventDefault();
      }
    },
    [singleLine]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, serializer]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deserializer, singleLine, pluginOptions, onPaste]
  );

  useLayoutEffect(() => {
    if (ctx) {
      ctx.setEditor(editor);
      ctx.setSingleLine(singleLine);
      ctx.setPlugins(plugins);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (autoFocus) {
      focusEditor(editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        data-testid="rfe"
      />
      {children}
    </Slate>
  );
};

export default FluentEdit;
