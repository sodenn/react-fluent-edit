import { Blockquote, Heading, List, ListItem } from "mdast";
import {
  ClipboardEvent,
  CSSProperties,
  FocusEvent,
  FunctionComponent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import { BaseEditor, Descendant, Editor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

interface LeafComponent {
  match: (props: RenderLeafProps) => boolean;
  component: FunctionComponent<RenderLeafProps>;
  priority?: number;
}

interface LeafStyle {
  match: (props: RenderLeafProps) => boolean;
  style: CSSProperties;
  priority?: number;
}

type Leaf = LeafComponent | LeafStyle;

interface Element {
  match: (props: RenderElementProps) => boolean;
  component: FunctionComponent<RenderElementProps>;
  priority?: number;
}

interface EventHandler<E> {
  handler: (ev: E, editor: Editor) => boolean;
  priority?: number;
}

interface EventHandlers {
  onClick?: EventHandler<MouseEvent<HTMLDivElement>>;
  onKeyDown?: EventHandler<KeyboardEvent<HTMLDivElement>>;
  onFocus?: EventHandler<FocusEvent<HTMLDivElement>>;
  onBlur?: EventHandler<FocusEvent<HTMLDivElement>>;
  onPaste?: EventHandler<ClipboardEvent<HTMLDivElement>>;
}

interface Serialize {
  /**
   * Called just before serializing or after deserializing.
   */
  handler: (nodes: Descendant[]) => Descendant[];

  /**
   * A high value results in earlier execution.
   */
  priority?: number;
}

interface Override {
  /**
   * Called when creating the editor.
   */
  handler: (editor: Editor) => Editor;

  /**
   * A high value results in earlier execution.
   */
  priority?: number;
}

interface Plugin<T = {}> {
  /**
   * Name of the plugin. Must be unique.
   */
  name: string;

  leaves?: Leaf[];

  /**
   * Register custom Elements.
   */
  elements?: Element[];
  handlers?: EventHandlers;

  /**
   * Called before the given data structure is converted to a string.
   */
  beforeSerialize?: Serialize;

  /**
   * Called after the given string is converted into a data structure.
   */
  afterDeserialize?: Serialize;

  /**
   * Modify the original behavior of the editor.
   */
  overrides?: Override[];

  /**
   * Custom options of the plugin.
   */
  options?: T;
}

interface WithChildrenProp {
  children?: ReactNode;
}

interface WithAlign {
  align?: any;
}

interface Root {
  type: "root";
  children: Descendant[];
}

interface ParagraphElement extends WithAlign {
  type: "paragraph";
  children: Descendant[];
}

interface MentionElement {
  type: "mention";
  value: string;
  trigger: string;
  style?: CSSProperties;
  children: CustomText[];
}

interface CustomText {
  text: string;
  strong?: boolean;
  emphasis?: boolean;
  code?: boolean;
  underline?: boolean;
}

type CustomElement =
  | ParagraphElement
  | MentionElement
  | Blockquote
  | List
  | ListItem
  | Heading;

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type {
  LeafComponent,
  EventHandler,
  EventHandlers,
  LeafStyle,
  Leaf,
  Element,
  Plugin,
  WithChildrenProp,
  Root,
  ParagraphElement,
  CustomText,
  CustomElement,
  MentionElement,
  WithAlign,
};
