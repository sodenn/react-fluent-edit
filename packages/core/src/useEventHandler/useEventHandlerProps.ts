import {
  ClipboardEvent,
  DragEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";

interface UseEventHandlersProps {
  onClick: (event: MouseEvent<HTMLDivElement>) => boolean;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => boolean;
  onFocus: (event: FocusEvent<HTMLDivElement>) => boolean;
  onBlur: (event: FocusEvent<HTMLDivElement>) => boolean;
  onPaste: (event: ClipboardEvent<HTMLDivElement>) => boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>) => boolean;
  onDrop: (event: DragEvent<HTMLDivElement>) => boolean;
}

export type { UseEventHandlersProps };
