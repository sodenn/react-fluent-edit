import remarkParse from "remark-parse";
import { remarkToSlate, slateToRemark } from "remark-slate-transformer";
import stringify from "remark-stringify";
import { Descendant } from "slate";
import { unified } from "unified";
import { Root } from "../types";
import { cloneChildren } from "../utils";

function markdown2slate(md: string): Descendant[] {
  const processor = unified().use(remarkParse).use(remarkToSlate);
  return processor.processSync(md).result as Descendant[];
}

function slate2markdown(nodes: Descendant[]): string {
  const processor = unified()
    .use(slateToRemark)
    .use(stringify as any);
  const root: Root = { type: "root", children: cloneChildren(nodes) };
  const ast = processor.runSync(root as any);
  // @ts-ignore
  return processor.stringify(ast);
}

export { markdown2slate, slate2markdown };
