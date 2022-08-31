import { getTokens } from "./tokenizer";

describe("tokenizer", () => {
  test("should add position to tokens", () => {
    const src = `## Title
- [ ] Task1 [#25](https://url)
  - [ ] Task2
- Item3
- Item4

## OK
![image](https://url)`;
    const tokens = getTokens(src);
    expect(JSON.stringify(tokens)).toBe(
      JSON.stringify([
        {
          type: "heading",
          raw: "## Title\n",
          depth: 2,
          text: "",
          tokens: [],
          _start: 0,
          _end: 9,
        },
        {
          type: "list",
          raw: "- [ ] Task1 [#25](https://url)\n  - [ ] Task2\n- Item3\n- Item4",
          ordered: false,
          start: "",
          loose: false,
          items: [
            {
              type: "list_item",
              raw: "- [ ] Task1 [#25](https://url)\n  - [ ] Task2\n",
              task: true,
              checked: false,
              loose: false,
              text: "Task1 [#25](https://url)\n- [ ] Task2",
              tokens: [
                {
                  type: "text",
                  raw: "Task1 [#25](https://url)\n",
                  text: "Task1 [#25](https://url)",
                  tokens: [
                    {
                      type: "text",
                      raw: "Task1 ",
                      text: "Task1 ",
                      _start: 15,
                      _end: 21,
                    },
                    {
                      type: "link",
                      raw: "[#25](https://url)",
                      href: "https://url",
                      title: null,
                      text: "#25",
                      tokens: [
                        {
                          type: "text",
                          raw: "#25",
                          text: "#25",
                          _start: 22,
                          _end: 25,
                        },
                      ],
                      _start: 21,
                      _end: 39,
                    },
                  ],
                  _start: 15,
                  _end: 40,
                },
                {
                  type: "list",
                  raw: "- [ ] Task2",
                  ordered: false,
                  start: "",
                  loose: false,
                  items: [
                    {
                      type: "list_item",
                      raw: "- [ ] Task2",
                      task: true,
                      checked: false,
                      loose: false,
                      text: "Task2",
                      tokens: [
                        {
                          type: "text",
                          raw: "Task2",
                          text: "Task2",
                          tokens: [
                            {
                              type: "text",
                              raw: "Task2",
                              text: "Task2",
                              _start: 48,
                              _end: 53,
                            },
                          ],
                          _start: 48,
                          _end: 53,
                        },
                      ],
                      _start: 42,
                      _end: 53,
                    },
                  ],
                  _start: 42,
                  _end: 53,
                },
              ],
              _start: 9,
              _end: 54,
            },
            {
              type: "list_item",
              raw: "- Item3\n",
              task: false,
              checked: false,
              loose: false,
              text: "Item3",
              tokens: [
                {
                  type: "text",
                  raw: "Item3",
                  text: "Item3",
                  tokens: [
                    {
                      type: "text",
                      raw: "Item3",
                      text: "Item3",
                      _start: 56,
                      _end: 61,
                    },
                  ],
                  _start: 56,
                  _end: 61,
                },
              ],
              _start: 54,
              _end: 62,
            },
            {
              type: "list_item",
              raw: "- Item4",
              task: false,
              checked: false,
              loose: false,
              text: "Item4",
              tokens: [
                {
                  type: "text",
                  raw: "Item4",
                  text: "Item4",
                  tokens: [
                    {
                      type: "text",
                      raw: "Item4",
                      text: "Item4",
                      _start: 64,
                      _end: 69,
                    },
                  ],
                  _start: 64,
                  _end: 69,
                },
              ],
              _start: 62,
              _end: 69,
            },
          ],
          _start: 9,
          _end: 69,
        },
        {
          type: "space",
          raw: "\n\n",
          _start: 69,
          _end: 71,
        },
        {
          type: "heading",
          raw: "## OK\n",
          depth: 2,
          text: "",
          tokens: [],
          _start: 71,
          _end: 77,
        },
        {
          type: "paragraph",
          raw: "![image](https://url)",
          text: "![image](https://url)",
          tokens: [
            {
              type: "image",
              raw: "![image](https://url)",
              href: "https://url",
              title: null,
              text: "image",
              _start: 77,
              _end: 98,
            },
          ],
          _start: 77,
          _end: 98,
        },
      ])
    );
  });
});
