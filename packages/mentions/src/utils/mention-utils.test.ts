import { createEditor, Transforms } from "slate";
import withMentions from "../withMentions";
import {
  addMentionNodes,
  getMentionItems,
  removeMentionNodes,
} from "./mention-utils";

describe("mention-utils", () => {
  it("should get mentions from plain text", () => {
    const items = getMentionItems(
      "+Proj1 lorem+Proj2 ipsum @Ctx1 dolor @Ctx1 sit amet @Ctx2 @Ctx3 due:2022-01-01",
      ["@", "+", "due:"]
    );
    expect(items).toStrictEqual([
      { start: 0, end: 6, value: "Proj1", trigger: "+" },
      { start: 25, end: 30, value: "Ctx1", trigger: "@" },
      { start: 37, end: 42, value: "Ctx1", trigger: "@" },
      { start: 52, end: 57, value: "Ctx2", trigger: "@" },
      { start: 58, end: 63, value: "Ctx3", trigger: "@" },
      { start: 64, end: 78, value: "2022-01-01", trigger: "due:" },
    ]);
  });

  it("should get descendant from plain text", () => {
    const editor = withMentions(createEditor());

    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [
        {
          text: "+Proj1 lorem+Proj2 ipsum @Ctx1 dolor @Ctx1 sit amet @Ctx2 @Ctx3 due:2022-01-01",
        },
      ],
    });

    addMentionNodes(editor, [
      { trigger: "@", style: { backgroundColor: "green" } },
      { trigger: "+", style: { backgroundColor: "blue" } },
      { trigger: "due:", style: { backgroundColor: "red" } },
    ]);

    expect(editor.children).toStrictEqual([
      {
        type: "paragraph",
        children: [
          { text: "" },
          {
            type: "mention",
            trigger: "+",
            value: "Proj1",
            style: { backgroundColor: "blue" },
            children: [{ text: "" }],
          },
          { text: " lorem+Proj2 ipsum " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx1",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " dolor " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx1",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " sit amet " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx2",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx3",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " " },
          {
            type: "mention",
            trigger: "due:",
            value: "2022-01-01",
            style: { backgroundColor: "red" },
            children: [{ text: "" }],
          },
          { text: "" },
        ],
      },
    ]);
  });

  it("should get mention nodes from plain text", () => {
    const editor = withMentions(createEditor());
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [
        {
          text: "+Proj1 lorem+Proj2 ipsum @Ctx1 dolor @Ctx1 sit amet @Ctx2 @Ctx3 due:2022-01-01",
        },
      ],
    });

    addMentionNodes(editor, [
      { trigger: "@", style: { backgroundColor: "green" } },
      { trigger: "+", style: { backgroundColor: "blue" } },
      { trigger: "due:", style: { backgroundColor: "red" } },
    ]);

    expect(editor.children).toStrictEqual([
      {
        type: "paragraph",
        children: [
          { text: "" },
          {
            type: "mention",
            trigger: "+",
            value: "Proj1",
            style: { backgroundColor: "blue" },
            children: [{ text: "" }],
          },
          { text: " lorem+Proj2 ipsum " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx1",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " dolor " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx1",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " sit amet " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx2",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " " },
          {
            type: "mention",
            trigger: "@",
            value: "Ctx3",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " " },
          {
            type: "mention",
            trigger: "due:",
            value: "2022-01-01",
            style: { backgroundColor: "red" },
            children: [{ text: "" }],
          },
          { text: "" },
        ],
      },
    ]);
  });

  it("should not manipulate a text node if no mentions are included", () => {
    const editor = withMentions(createEditor());
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [
        {
          text: "Text without mentions",
        },
      ],
    });

    addMentionNodes(editor, [
      { trigger: "@", style: { backgroundColor: "green" } },
      { trigger: "+", style: { backgroundColor: "blue" } },
    ]);

    expect(editor.children).toStrictEqual([
      {
        type: "paragraph",
        children: [{ text: "Text without mentions" }],
      },
    ]);
  });

  it("should contain a text node at the end", () => {
    const editor = withMentions(createEditor());
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [
        {
          text: "This is a @small test",
        },
      ],
    });

    addMentionNodes(editor, [
      { trigger: "@", style: { backgroundColor: "green" } },
      { trigger: "+", style: { backgroundColor: "blue" } },
    ]);

    expect(editor.children).toStrictEqual([
      {
        type: "paragraph",
        children: [
          { text: "This is a " },
          {
            type: "mention",
            trigger: "@",
            value: "small",
            style: { backgroundColor: "green" },
            children: [{ text: "" }],
          },
          { text: " test" },
        ],
      },
    ]);
  });

  it("should remove mention nodes from editor", () => {
    const editor = withMentions(createEditor());

    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [
        {
          text: "+Proj1 lorem+Proj2 ipsum @Ctx1 dolor @Ctx1 sit amet @Ctx2 @Ctx3 due:2022-01-01",
        },
      ],
    });

    addMentionNodes(editor, [
      { trigger: "@", style: { backgroundColor: "green" } },
      { trigger: "+", style: { backgroundColor: "blue" } },
      { trigger: "due:", style: { backgroundColor: "red" } },
    ]);

    removeMentionNodes(editor);

    expect(editor.children).toStrictEqual([
      {
        type: "paragraph",
        children: [
          {
            text: "+Proj1 lorem+Proj2 ipsum @Ctx1 dolor @Ctx1 sit amet @Ctx2 @Ctx3 due:2022-01-01",
          },
        ],
      },
    ]);
  });
});
