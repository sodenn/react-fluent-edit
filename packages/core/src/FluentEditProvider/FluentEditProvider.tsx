import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Editor, Transforms } from "slate";
import { useDeserialize } from "../serialize";
import { Plugin } from "../types";
import { focusEditor as _focusEditor } from "../utils";
import { getPluginOptions } from "../utils/plugin-utils";
import {
  FluentEditContext,
  FluentEditProviderProps,
} from "./FluentEditProviderProps";

const nest = (children: ReactNode, component: ReactElement) =>
  cloneElement(component, {}, children);

// @ts-ignore
const FluentEditCtx = createContext<FluentEditContext>(undefined);

function FluentEditProvider({
  children,
  providers = [],
}: FluentEditProviderProps) {
  const [editor, setEditor] = useState<Editor | undefined>(undefined);
  const [singleLine, setSingleLine] = useState(false);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const deserializer = useDeserialize(plugins);

  const focusEditor = useCallback(() => {
    if (editor) {
      _focusEditor(editor);
    }
  }, [editor]);

  const resetEditor = useCallback(
    (text = "") => {
      if (editor) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.delete(editor, {
            at: [0],
          });
          const nodes = deserializer(
            text,
            singleLine,
            getPluginOptions(plugins)
          );
          Transforms.insertNodes(editor, nodes);
          focusEditor();
        });
      }
    },
    [editor, focusEditor, plugins, deserializer]
  );

  const value = {
    editor,
    setEditor,
    focusEditor,
    resetEditor,
    singleLine,
    setSingleLine,
    plugins,
    setPlugins,
  };

  return (
    <FluentEditCtx.Provider value={value}>
      {providers.reduceRight(nest, children)}
    </FluentEditCtx.Provider>
  );
}

export default FluentEditProvider;

export { FluentEditCtx };
