import { ChipComponent } from "@react-fluent-edit/core";

interface DnDMatch {
  raw: string;
  text: string;
  start: number;
  end: number;
}

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
