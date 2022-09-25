import { describe, expect, it } from "vitest";
import { getTokens } from "./tokenizer";

describe("tokenizer", () => {
  it("should add position to tokens", () => {
    const src = `# Title
1. ItemA
   1. Item1
   2. Item2
2. ItemB

## OK`;
    const tokens = getTokens(src);
    expect(JSON.stringify(tokens)).toBe(
      JSON.stringify([
        {
          type: "heading",
          raw: "# Title\n",
          depth: 1,
          text: "Title",
          tokens: [
            {
              type: "text",
              raw: "Title",
              text: "Title",
              _start: 2,
              _end: 7,
            },
          ],
          _start: 0,
          _end: 8,
        },
        {
          type: "list_item",
          raw: "1. ItemA\n",
          text: "ItemA",
          _start: 8,
          _end: 17,
        },
        {
          type: "list_item",
          raw: "   1. Item1\n",
          text: "Item1",
          _start: 17,
          _end: 29,
        },
        {
          type: "list_item",
          raw: "   2. Item2\n",
          text: "Item2",
          _start: 29,
          _end: 41,
        },
        {
          type: "list_item",
          raw: "2. ItemB",
          text: "ItemB",
          _start: 41,
          _end: 49,
        },
        {
          type: "space",
          raw: "\n\n",
          _start: 49,
          _end: 51,
        },
        {
          type: "heading",
          raw: "## OK",
          depth: 2,
          text: "OK",
          tokens: [
            {
              type: "text",
              raw: "OK",
              text: "OK",
              _start: 54,
              _end: 56,
            },
          ],
          _start: 51,
          _end: 56,
        },
      ])
    );
  });
});
