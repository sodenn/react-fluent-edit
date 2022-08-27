import {
  ClipboardEvent,
  CSSProperties,
  FocusEvent,
  FunctionComponent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import { BaseEditor, BaseRange, Descendant, Editor, NodeEntry } from "slate";
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
   * Called just before serializing.
   */
  handler: (nodes: Descendant[]) => Descendant[];

  /**
   * A high value results in earlier execution.
   */
  priority?: number;
}

interface Deserialize {
  /**
   * Called just after deserializing.
   */
  handler: (nodes: Descendant[], props: unknown) => Descendant[];

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

type Decorate = (entry: NodeEntry) => BaseRange[];

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
  afterDeserialize?: Deserialize;

  /**
   *
   */
  decorate?: Decorate;

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

interface WithChildren {
  children: Descendant[];
}

interface Root {
  type: "root";
  children: Descendant[];
}

interface Paragraph {
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
  marker?: boolean;
  strong?: boolean;
  em?: boolean;
  codespan?: boolean;
  del?: boolean;
  // link
  link?: boolean;
  href?: string;
  title?: string;
}

interface Heading {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[];
}

interface List {
  type: "list";
  ordered: boolean;
  start: number | "";
  loose: boolean;
  children: ListItem[];
}

interface ListItem {
  type: "list_item";
  task: boolean;
  checked?: boolean | undefined;
  loose: boolean;
  children: Descendant[];
}

type CustomElement =
  | Root
  | Paragraph
  | MentionElement
  | Heading
  | List
  | ListItem;

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
  Decorate,
  WithChildrenProp,
  WithChildren,
  Root,
  Paragraph,
  Heading,
  List,
  ListItem,
  CustomText,
  CustomElement,
  MentionElement,
};
