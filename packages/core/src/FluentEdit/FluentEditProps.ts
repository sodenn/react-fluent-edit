import { Dispatch, SetStateAction, TextareaHTMLAttributes } from "react";
import { Editor } from "slate";
import { Plugin } from "../types";

interface FluentEditProps
  extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange"> {
  singleLine?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  plugins?: Plugin[];
}

interface FluentEditInternalProps extends FluentEditProps {
  singleLine: boolean;
  onCreateEditor?: Dispatch<SetStateAction<Editor>>;
}

export type { FluentEditProps, FluentEditInternalProps };
