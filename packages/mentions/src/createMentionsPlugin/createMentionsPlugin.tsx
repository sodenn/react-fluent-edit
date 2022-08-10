import { Plugin } from "@react-fluent-edit/core";
import MentionsComponent from "../MentionsComponent";
import { Mention, MentionsPluginOptions } from "../types";
import { withMentionNodes, withoutMentionNodes } from "../utils";
import withMentions from "../withMentions";

function createMentionsPlugin(
  options: MentionsPluginOptions
): Plugin<MentionsPluginOptions> {
  return {
    name: "mentions",
    elements: [
      {
        match: ({ element: { type } }) => type === "mention",
        component: MentionsComponent,
      },
    ],
    overrides: [{ handler: (editor) => withMentions(editor) }],
    beforeSerialize: {
      handler: (nodes) => {
        return withoutMentionNodes(nodes);
      },
    },
    afterDeserialize: {
      handler: (nodes, options: { mentions: Mention[] }) => {
        const mentions = options.mentions;
        return withMentionNodes(nodes, mentions);
      },
    },
    options,
  };
}

export default createMentionsPlugin;
