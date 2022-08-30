import { getTokens } from "./tokenizer";

describe("tokenizer", () => {
  test("should add position to tokens", () => {
    let src = `## Title
- [ ] Task1 [#25](https://url)
  - [ ] Task2
- Item3
- Item4

## OK
![image](https://url)
`;

    const src2 = `1. aaa
   - bbb
   - ccc
2. ddd`;
    const tokens = getTokens(src2);
    expect(tokens).toBeDefined();
  });
});
