import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { BaseRange, Editor, Range } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import useComponents from "../useComponents";
import { ComboboxItemProps, ComboboxProps } from "./ComboboxProps";

const getIndexFromChildren = (children: React.ReactNode) => {
  const containsComboboxItems = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<ComboboxItemProps>(child) &&
      (child.type as any).displayName === "ComboboxItem"
  );
  const i = React.Children.toArray(children).findIndex(
    (child) =>
      React.isValidElement<ComboboxItemProps>(child) &&
      (child.type as any).displayName === "ComboboxItem" &&
      child.props.selected
  );
  return i === -1 ? (containsComboboxItems ? 0 : undefined) : i;
};

const Portal = ({ children }: PropsWithChildren) => {
  return typeof document === "object"
    ? createPortal(children, document.body)
    : null;
};

const ComboboxItem = forwardRef<HTMLLIElement, ComboboxItemProps>(
  (props, ref) => {
    const { comboboxItemComponent: Component } = useComponents();
    return <Component {...props} ref={ref} />;
  }
);

ComboboxItem.displayName = "ComboboxItem";

function setComboboxStyle(comboboxElem: HTMLElement, rect: DOMRect) {
  try {
    if (
      comboboxElem.offsetWidth + rect.left + window.pageXOffset <
      window.outerWidth - 16
    ) {
      comboboxElem.style.left = `${rect.left + window.pageXOffset}px`;
      comboboxElem.style.right = "auto";
    } else {
      comboboxElem.style.left = "auto";
      comboboxElem.style.right = "16px";
    }
    comboboxElem.style.top = `${rect.top + window.pageYOffset + 24}px`;
  } catch (e) {
    //
  }
}

function setComboboxPositionByRange(
  editor: Editor,
  comboboxElem: HTMLDivElement | null,
  range: BaseRange
) {
  if (!comboboxElem) {
    return;
  }
  try {
    const domRange = ReactEditor.toDOMRange(editor, range);
    const rect = domRange.getBoundingClientRect();
    setComboboxStyle(comboboxElem, rect);
  } catch (e) {
    //
  }
}

function setComboboxPositionByCursor(
  editor: Editor,
  comboboxElem: HTMLDivElement | null
) {
  const { selection } = editor;
  if (selection && Range.isCollapsed(selection)) {
    const [start] = Range.edges(selection);
    const before = Editor.before(editor, start, { unit: "character" });
    const range = before && Editor.range(editor, before, start);
    const domRange = range && ReactEditor.toDOMRange(editor, range);
    const rect = domRange && domRange.getBoundingClientRect();
    if (!rect || !comboboxElem) {
      return;
    }
    setComboboxStyle(comboboxElem, rect);
  }
}

const Combobox = forwardRef<HTMLUListElement, ComboboxProps>((props, ref) => {
  const {
    open = false,
    onClose,
    onSelectItem,
    range,
    children,
    ...other
  } = props;
  const [index, setIndex] = useState(() => getIndexFromChildren(children));
  const { comboboxComponent: Component, comboboxRootStyle } = useComponents();
  const editor = useSlateStatic();
  const numItems = React.Children.toArray(children).reduce<number>(
    (prev, curr) =>
      React.isValidElement(curr) &&
      (curr.type as any).displayName === "ComboboxItem"
        ? prev + 1
        : prev,
    0
  );
  const [comboboxElem, setComboboxElem] = useState<HTMLDivElement | null>(null);

  const handleArrowDownPress = useCallback(
    (event: KeyboardEvent) => {
      if (numItems === 0 || typeof index !== "number") {
        return;
      }
      event.preventDefault();
      const newIndex = index < numItems - 1 ? index + 1 : 0;
      onSelectItem?.(newIndex);
      setIndex(newIndex);
    },
    [index, numItems, onSelectItem]
  );

  const handleArrowUpPress = useCallback(
    (event: KeyboardEvent) => {
      if (numItems === 0 || typeof index !== "number") {
        return;
      }
      event.preventDefault();
      const newIndex = index === 0 ? numItems - 1 : index - 1;
      onSelectItem?.(newIndex);
      setIndex(newIndex);
    },
    [index, numItems, onSelectItem]
  );

  const handleTabPress = useCallback(
    (event: KeyboardEvent) => {
      onClose(event, "tabPress", index);
    },
    [index, onClose]
  );

  const handleEnterPress = useCallback(
    (event: KeyboardEvent) => {
      onClose(event, "enterPress", index);
    },
    [index, onClose]
  );

  const handleEscapePress = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onClose(event, "escapePress", index);
    },
    [index, onClose]
  );

  const handleSpacePress = useCallback(
    (event: KeyboardEvent) => {
      onClose(event, "spacePress", index);
    },
    [index, onClose]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          handleArrowDownPress(event);
          break;
        case "ArrowUp":
          handleArrowUpPress(event);
          break;
        case "Tab":
          handleTabPress(event);
          break;
        case "Enter":
          handleEnterPress(event);
          break;
        case "Escape":
          handleEscapePress(event);
          break;
        case " ":
          handleSpacePress(event);
          break;
      }
    },
    [
      handleArrowDownPress,
      handleArrowUpPress,
      handleEnterPress,
      handleEscapePress,
      handleSpacePress,
      handleTabPress,
    ]
  );

  const handleBlur = useCallback(
    (event: any) => {
      onClose(event, "clickAway", index);
    },
    [index, onClose]
  );

  useEffect(() => {
    const editorRef = ReactEditor.toDOMNode(editor, editor);
    if (open) {
      editorRef.addEventListener("keydown", handleKeyDown);
      editorRef.addEventListener("blur", handleBlur);
    }
    return () => {
      editorRef.removeEventListener("keydown", handleKeyDown);
      editorRef.removeEventListener("blur", handleBlur);
    };
  }, [index, editor, open, onClose, handleKeyDown, handleBlur]);

  useEffect(() => {
    if (open) {
      setIndex(getIndexFromChildren(children));
      if (range) {
        setComboboxPositionByRange(editor, comboboxElem, range);
      } else {
        setComboboxPositionByCursor(editor, comboboxElem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, comboboxElem, range, editor]);

  return (
    <Portal>
      <div
        // keep focus in text field
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        style={{
          top: "-9999px",
          left: "-9999px",
          position: "absolute",
          display: open ? "block" : "none",
          ...comboboxRootStyle,
        }}
        ref={setComboboxElem}
      >
        <Component in={open} ref={ref as any} {...other}>
          {React.Children.map(children, (child, i) => {
            if (!React.isValidElement<ComboboxItemProps>(child)) {
              return null;
            }
            return React.cloneElement(
              child,
              { ...child.props, selected: i === index },
              child.props.children
            );
          })}
        </Component>
      </div>
    </Portal>
  );
});

export default Combobox;
export { ComboboxItem };
