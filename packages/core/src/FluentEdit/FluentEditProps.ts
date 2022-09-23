import { Dispatch, SetStateAction, TextareaHTMLAttributes } from "react";
import { Editor } from "slate";
import { Plugin } from "../types";

interface FluentEditProps
  extends Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
  singleLine?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  plugins?: Plugin[];
}

interface FluentEditInternalProps extends FluentEditProps {
  singleLine: boolean;
  onCreateEditor?: Dispatch<SetStateAction<Editor | undefined>>;
}

export type { FluentEditProps, FluentEditInternalProps };
