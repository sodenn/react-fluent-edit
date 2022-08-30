import { marked } from "marked";

interface WithPosition {
  _start: number;
  _end: number;
}

type Token = marked.Token & WithPosition;

function hasTokens(token: any): token is { tokens?: Token[]; items?: Token[] } {
  return !!token.tokens || !!token.items;
}

const rules = {
  heading: /^(#{1,6})(\s+)(.+)(?:\n+|$)/,
  list: / *(?:[*+-]|\d+[.)]) /,
};

function addPositions(src: string) {
  return (token: Token) => {
    if (hasTokens(token)) {
      const subs = token.tokens || token.items;
      if (subs) {
        const start = token._start || 0;
        let subpos = 0;
        subs.forEach((sub) => {
          const substart = token.raw.indexOf(sub.raw, subpos);
          const sublen = sub.raw.length;
          sub._start = substart + start;
          sub._end = sub._start + sublen;

          // const lines = src.substring(0, sub._start).split("\n");
          // const lineNumber = lines.length;
          // const startFromBeginningOfLine = lines.reduce((prev, curr, index) => {
          //   if (index + 1 < lines.length) {
          //     prev += curr.length;
          //   }
          //   return prev;
          // }, 0);
          // const p1 = lines.length - 1;
          // const p2 = sub._start - startFromBeginningOfLine;
          // const position = [p1, p2];
          // console.log(position);

          subpos = substart + sublen;
        });
      }
    }
  };
}

function getTokens(src: string): Token[] {
  const lexer = new marked.Lexer();

  // override rules
  // @ts-ignore
  const tokenizerRules = lexer.tokenizer.rules;
  tokenizerRules.block.heading = rules.heading;

  const tokens = lexer.lex(src);

  // add position to each token
  const root: any = [
    {
      raw: src,
      tokens,
    },
  ];
  marked.walkTokens(root, addPositions(src));

  return tokens as any;
}

function walkTokens(tokens: Token[], fn: (token: Token) => void) {
  marked.walkTokens(tokens, fn);
}

export { getTokens, walkTokens, Token, rules };
