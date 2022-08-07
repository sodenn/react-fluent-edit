import {
  cloneElement,
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { Editor } from "slate";
import { focusEditor as _focusEditor } from "../utils";
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

  const focusEditor = useCallback(() => {
    if (editor) {
      _focusEditor(editor);
    }
  }, [editor]);

  const value = {
    editor,
    setEditor,
    focusEditor,
  };

  return (
    <FluentEditCtx.Provider value={value}>
      {providers.reduceRight(nest, children)}
    </FluentEditCtx.Provider>
  );
}

export default FluentEditProvider;

export { FluentEditCtx };
