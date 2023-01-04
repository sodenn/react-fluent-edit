# @react-fluent-edit/core

This package includes the core editor component and tools to create plugins.

## Installation

Install the package in your project directory with:

```bash
// with npm
npm install @react-fluent-edit/core

// with yarn
yarn add @react-fluent-edit/core
```

## API

### FluentEdit

```tsx
import {
  FluentEdit,
  FluentEditProps,
  FluentEditProvider,
} from "@react-fluent-edit/core";

return (
  <FluentEdit 
    multiline={true}
    autoFocus={true}
    placeholder=""
    initialValue=""
    onChange={value => console.log(value)}
    plugins={[...]}
  />
);
```

### Plugin

```tsx
import { Plugin } from "@react-fluent-edit"

const plugin: Plugin = {
  name: "mentions",
  leave: {
    match: ({ leaf }) => ["bold", "italic", "underline"]
      .some(prop => leaf[prop]),
    component: Leaf,
  },
  element: {
    match: ({ element: { type } }) => ["list", "heading"]
      .some(item => type === item),
    component: Element,
  },
  override: (editor) => withRichText(editor),
  beforeSerialize: {
    handler: (nodes) => replaceTextNodesWithRichTextNodes(nodes),
  },
  afterDeserialize: {
    handler: (nodes) => replaceRichTextNodesWithTextNodes(nodes),
  },
  handlers: {
    onClick: (event, editor) => { ... }
  },
  options,
}
```

### useFluentEdit hook

```tsx
import { useFluentEdit } from "@react-fluent-edit"

const { editor, focusEditor } = useFluentEdit()
```
