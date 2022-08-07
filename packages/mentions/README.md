# @react-fluent-edit/mentions

## Installation

Install the package in your project directory with:

```bash
// with npm
npm install @react-fluent-edit/mentions

// with yarn
yarn add @react-fluent-edit/mentions
```

## API

### Plugin

```tsx
import { createMentionsPlugin, Plugin } from "@react-fluent-edit/mentions"

const plugins: Plugin = [
  createMentionsPlugin({
    mentions: [
      {
        trigger: "@",
        style: {
          color: "#17501b",
          backgroundColor: "#c8efcb",
        },
      }
    ],
  })
];

...

return (
  <FluentEdit plugins={plugins}>
    <MentionsCombobox items={items} />
  </FluentEdit>
);
```

### MentionsCombobox

```tsx
import { MentionsCombobox } from "@react-fluent-edit/mentions"

const [items] = useState<MentionItem[]>([
  { text: "Jane", trigger: "@" },
  { text: "John", trigger: "@" },
]);

...

return (
  <FluentEdit>
    <MentionsCombobox items={items} />
  </FluentEdit>
);
```

### useMentions hook

```tsx
import { useMentions } from "@react-fluent-edit/mentions"

...

const { addMention, removeMentions, renameMentions, openMentionsCombobox } = useMentions();
```
