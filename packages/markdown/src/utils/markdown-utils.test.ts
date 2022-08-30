import { expect } from "@playwright/test";
import { CustomElement, CustomText } from "@react-fluent-edit/core";
import { createEditor } from "slate";
import {
  decorateMarkdown,
  withMarkdownNodes,
  withoutMarkdownNodes,
} from "./markdown-utils";

describe("markdown-utils", () => {
  test("should add ordered list elements", () => {
    const nodes: CustomElement[] = [
      { type: "paragraph", children: [{ text: "1. aaa" }] },
      { type: "paragraph", children: [{ text: "   - bbb" }] },
      { type: "paragraph", children: [{ text: "   - ccc" }] },
      { type: "paragraph", children: [{ text: "2. ddd" }] },
    ];
    const nodesWithMarkdown = withMarkdownNodes(nodes);
    expect(nodesWithMarkdown).toStrictEqual([
      {
        type: "list",
        start: 1,
        ordered: true,
        loose: false,
        children: [
          {
            type: "list_item",
            task: false,
            loose: false,
            checked: undefined,
            children: [
              {
                text: "aaa",
              },
              {
                type: "list",
                ordered: false,
                start: "",
                loose: false,
                children: [
                  {
                    type: "list_item",
                    task: false,
                    loose: false,
                    checked: undefined,
                    children: [
                      {
                        text: "bbb",
                      },
                    ],
                  },
                  {
                    type: "list_item",
                    task: false,
                    loose: false,
                    checked: undefined,
                    children: [
                      {
                        text: "ccc",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: "list_item",
            task: false,
            loose: false,
            checked: undefined,
            children: [
              {
                text: "ddd",
              },
            ],
          },
        ],
      },
    ]);
  });

  test("should add heading element", () => {
    const nodes: CustomElement[] = [
      { type: "paragraph", children: [{ text: "# Test" }] },
    ];
    const nodesWithMarkdown = withMarkdownNodes(nodes);
    expect(nodesWithMarkdown).toStrictEqual([
      { type: "heading", depth: 1, children: [{ text: "# Test" }] },
    ]);
  });

  test("should remove heading element", () => {
    const nodesWithMarkdown: CustomElement[] = [
      { type: "heading", depth: 1, children: [{ text: "# Test" }] },
    ];
    const nodes = withoutMarkdownNodes(nodesWithMarkdown);
    expect(nodes).toStrictEqual([
      { type: "paragraph", children: [{ text: "# Test" }] },
    ]);
  });

  test("should decorate markdown entries", () => {
    const entry: CustomText = {
      text: "Lorem *ipsum **dolor** sit amet*",
    };
    const path = [0, 0];
    const editor = createEditor();
    editor.children = [{ type: "paragraph", children: [entry] }];

    const ranges = decorateMarkdown([entry, path], editor);

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
