import * as React from "react";
import { DnDMatchFn } from "../types";

export interface DraggableProps {
  value: string;
  component: React.ElementType;
  match?: DnDMatchFn;
}
