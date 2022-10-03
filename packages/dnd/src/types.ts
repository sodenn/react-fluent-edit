import { ChipComponent } from "@react-fluent-edit/core";

interface DnDMatch {
  raw: string;
  text: string;
  start: number;
  end: number;
}

/**
 * Finds the position of all DnD entries in a text to highlight them.
 * The default pattern is <code>{{text}}</code>.
 * @example
 * // Finds all positions with the pattern: [[text]]
 * function match(text: string) {
 *   const result: DnDMatch[] = [];
 *   for (const match of text.matchAll(/\[\[(.[^\[\]]+)\]\]/g)) {
 *     const [raw, text] = match;
 *     const start = match.index || 0;
 *     const end = start + raw.length;
 *     result.push({
 *       text,
 *       raw,
 *       start,
 *       end,
 *     });
 *   }
 *   return result;
 * }
 */
type DnDMatchFn = (text: string) => DnDMatch[];

interface DnDPluginOptions {
  match?: DnDMatchFn;
  chipComponent?: ChipComponent;
  handlers?: {
    onDragOver?: {
      priority?: number;
    };
    onDrop?: {
      priority?: number;
    };
  };
}

export type { DnDPluginOptions, DnDMatch, DnDMatchFn };
