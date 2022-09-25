import { CustomText } from "@react-fluent-edit/core";
import { createEditor } from "slate";
import { describe, expect, it } from "vitest";
import { decorateMarkdown } from "./markdown-utils";

describe("markdown-utils", () => {
  it("should decorate markdown entries", () => {
    const node: CustomText = {
      text: "Lorem *ipsum **dolor** sit amet*",
    };
    const path = [0, 0];
    const editor = createEditor();
    editor.children = [{ type: "paragraph", children: [node] }];

    const ranges = decorateMarkdown({
      entry: [node, path],
      editor,
      options: {},
    });

    expect(ranges).toStrictEqual([
      {
        em: true,
        anchor: {
          path: [0, 0],
          offset: 6,
        },
        focus: {
          path: [0, 0],
          offset: 32,
        },
      },
      {
        marker: true,
        anchor: {
          path: [0, 0],
          offset: 6,
        },
        focus: {
          path: [0, 0],
          offset: 7,
        },
      },
      {
        marker: true,
        anchor: {
          path: [0, 0],
          offset: 31,
        },
        focus: {
          path: [0, 0],
          offset: 32,
        },
      },
      {
        strong: true,
        anchor: {
          path: [0, 0],
          offset: 13,
        },
        focus: {
          path: [0, 0],
          offset: 22,
        },
      },
      {
        marker: true,
        anchor: {
          path: [0, 0],
          offset: 13,
        },
        focus: {
          path: [0, 0],
          offset: 15,
        },
      },
      {
        marker: true,
        anchor: {
          path: [0, 0],
          offset: 20,
        },
        focus: {
          path: [0, 0],
          offset: 22,
        },
      },
    ]);
  });
});
