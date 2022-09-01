import { marked } from "marked";

interface WithPosition {
  _start: number;
  _end: number;
}

type Token = marked.Token & WithPosition;
type HeadingToken = marked.Tokens.Heading & WithPosition;

function hasTokens(token: any): token is { tokens?: Token[]; items?: Token[] } {
  return !!token.tokens || !!token.items;
}

const rules = {
  heading: /^(#{1,6})(\s+)(.+)(?:\n+|$)/,
  list: /^ *(?:[*+-]|\d+[.)]) /,
};

function addPositions(token: Token) {
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
        subpos = substart + sublen;
      });
    }
  }
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
  marked.walkTokens(root, addPositions);

  return tokens as any;
}

function walkTokens(tokens: Token[], fn: (token: Token) => void) {
  marked.walkTokens(tokens, fn);
}

export { getTokens, walkTokens, Token, HeadingToken, rules };
