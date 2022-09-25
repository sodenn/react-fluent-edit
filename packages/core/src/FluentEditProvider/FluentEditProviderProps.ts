import { Dispatch, ReactElement, SetStateAction } from "react";
import { Editor } from "slate";
import { WithChildrenProp } from "../types";

interface FluentEditContext {
  editor?: Editor;
  setEditor: Dispatch<SetStateAction<Editor | undefined>>;
  focusEditor: () => void;
}

interface FluentEditProviderProps extends WithChildrenProp {
  providers?: ReactElement[];
}

export type { FluentEditContext, FluentEditProviderProps };
