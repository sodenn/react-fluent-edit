import React, {
  ClipboardEvent,
  CSSProperties,
  DragEvent,
  FocusEvent,
  FunctionComponent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from "react";
import { BaseEditor, BaseRange, Descendant, Editor, NodeEntry } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

interface CustomRenderElementProps<T>
  extends Omit<RenderElementProps, "element"> {
  element: T;
}

interface LeafComponent {
  match: (props: RenderLeafProps) => boolean;
  component: FunctionComponent<RenderLeafProps>;
}

interface LeafStyle {
  match: (props: RenderLeafProps) => boolean;
  style: CSSProperties;
}

type Leaf = LeafComponent | LeafStyle;

interface Element {
  match: (props: RenderElementProps) => boolean;
  component: FunctionComponent<CustomRenderElementProps<any>>;
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
  onDragOver?: EventHandler<DragEvent<HTMLDivElement>>;
  onDrop?: EventHandler<DragEvent<HTMLDivElement>>;
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
  handler: (nodes: Descendant[], props: any) => Descendant[];

  /**
   * A high value results in earlier execution.
   */
  priority?: number;
}

type Override<T = {}> = (editor: Editor, options: T) => Editor;

interface DecoratorProps<T = {}> {
  entry: NodeEntry;
  editor: Editor;
  options: T;
}

type Decorate = (props: DecoratorProps) => BaseRange[];

interface Plugin<T = {}> {
  /**
   * Name of the plugin. Must be unique.
   */
  name: string;

  /**
   * Register a custom Leaf.
   */
  leave?: Leaf;

  /**
   * Register a custom Element.
   */
  element?: Element;

  /**
   * Editor event handlers.
   */
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
   * Apply text-level formatting in the editor.
   */
  decorate?: Decorate;

  /**
   * Modify the original behavior of the editor.
   */
  override?: Override;

  /**
   * Custom options of the plugin.
   */
  options?: T;
  editorComponents?: React.ElementType[];
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

interface Mention {
  type: "mention";
  value: string;
  trigger: string;
  style?: CSSProperties;
  children: CustomText[];
}

interface DnD {
  type: "dnd";
  value: string;
  raw: string;
  children: CustomText[];
}

interface CustomText {
  text: string;
  marker?: boolean;
  strong?: boolean;
  em?: boolean;
  codespan?: boolean;
  del?: boolean;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  // link
  link?: boolean;
  href?: string;
  title?: string;
}

type CustomElement = Root | Paragraph | Mention | DnD;

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type {
  CustomRenderElementProps,
  LeafComponent,
  EventHandler,
  EventHandlers,
  LeafStyle,
  Leaf,
  Element,
  Plugin,
  DecoratorProps,
  Decorate,
  WithChildrenProp,
  WithChildren,
  Root,
  Paragraph,
  CustomText,
  CustomElement,
  Mention,
  DnD,
};
