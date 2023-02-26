import { Plugin } from "@react-fluent-edit/core";
import { MentionCombobox, MentionItem } from "@react-fluent-edit/mentions";
import MentionElement from "../MentionElement";
import { MentionsPluginOptions } from "../types";
import { withMentionNodes, withoutMentionNodes } from "../utils";
import withMentions from "../withMentions";

interface DeserializeOptions extends MentionsPluginOptions {
  componentProps?: [{ MentionsCombobox: { items: MentionItem[] } }];
}

function createMentionsPlugin(
  options: MentionsPluginOptions
): Plugin<MentionsPluginOptions> {
  return {
    name: "mentions",
    element: {
      match: ({ element: { type } }) => type === "mention",
      component: MentionElement,
    },
    override: withMentions,
    beforeSerialize: {
      handler: (nodes) => {
        return withoutMentionNodes(nodes);
      },
    },
    afterDeserialize: {
      handler: (nodes, options: DeserializeOptions) => {
        const allowedItems = options.componentProps?.flatMap(
          (props) => props?.MentionsCombobox?.items
        );
        const mentions = options.mentions;
        return withMentionNodes({
          nodes,
          mentions,
          allowedItems,
          disableCreatable: options.disableCreatable,
        });
      },
    },
    editorComponents: [MentionCombobox],
    options,
  };
}

export default createMentionsPlugin;
