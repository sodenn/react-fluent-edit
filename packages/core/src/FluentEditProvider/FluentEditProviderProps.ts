import { Dispatch, ReactElement, SetStateAction } from "react";
import { Editor } from "slate";
import { Plugin, WithChildrenProp } from "../types";

interface FluentEditContext {
  editor?: Editor;
  setEditor: Dispatch<SetStateAction<Editor | undefined>>;
  multiline?: boolean;
  setMultiline: Dispatch<SetStateAction<boolean>>;
  plugins?: Plugin[];
  setPlugins: Dispatch<SetStateAction<Plugin[]>>;
  focusEditor: () => void;
  resetEditor: (text?: string) => void;
}

interface FluentEditProviderProps extends WithChildrenProp {
  providers?: ReactElement[];
}

export type { FluentEditContext, FluentEditProviderProps };
