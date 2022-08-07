import { ClipboardEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";

interface UseEventHandlersProps {
  onClick: (event: MouseEvent<HTMLDivElement>) => boolean;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => boolean;
  onFocus: (event: FocusEvent<HTMLDivElement>) => boolean;
  onBlur: (event: FocusEvent<HTMLDivElement>) => boolean;
  onPaste: (event: ClipboardEvent<HTMLDivElement>) => boolean;
}

export type { UseEventHandlersProps };
