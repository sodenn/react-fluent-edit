import { Plugin } from "@react-fluent-edit/core";
import MentionsComponent from "../MentionsComponent";
import { MentionsPluginOptions } from "../types";
import { withoutMentionNotes } from "../utils";
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
        return withoutMentionNotes(nodes);
      },
    },
    options,
  };
}

export default createMentionsPlugin;
