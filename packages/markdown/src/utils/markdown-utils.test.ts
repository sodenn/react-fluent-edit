import { expect } from "@playwright/test";
import { CustomElement, CustomText } from "@react-fluent-edit/core";
import {
  decorateMarkdown,
  withMarkdownNodes,
  withoutMarkdownNodes,
} from "./markdown-utils";

describe("markdown-utils", () => {
  test("should add markdown nodes", () => {
    const nodes: CustomElement[] = [
      { type: "paragraph", children: [{ text: "# Test" }] },
    ];
    const nodesWithMarkdown = withMarkdownNodes(nodes);
    expect(nodesWithMarkdown).toStrictEqual([
      { type: "heading", depth: 1, children: [{ text: "# Test" }] },
    ]);
  });

  test("should remove markdown nodes", () => {
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

    const ranges = decorateMarkdown([entry, path]);

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
