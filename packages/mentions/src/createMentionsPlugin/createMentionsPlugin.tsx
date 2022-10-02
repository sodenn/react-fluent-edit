import { Plugin } from "@react-fluent-edit/core";
import MentionElement from "../MentionElement";
import { MentionsPluginOptions } from "../types";
import { withMentionNodes, withoutMentionNodes } from "../utils";
import withMentions from "../withMentions";

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
      handler: (nodes, options: MentionsPluginOptions) => {
        const mentions = options.mentions;
        return withMentionNodes(nodes, mentions);
      },
    },
    options,
  };
}

export default createMentionsPlugin;
