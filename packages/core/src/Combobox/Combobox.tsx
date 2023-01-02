import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { BaseRange, Editor, Range } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import useComponents from "../useComponents";
import { ComboboxItemProps, ComboboxProps } from "./ComboboxProps";

const getIndexFromChildren = (children: React.ReactNode) => {
  const i = React.Children.toArray(children).findIndex(
    (child) =>
      React.isValidElement<ComboboxItemProps>(child) && child.props.selected
  );
  return i === -1 ? 0 : i;
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
  const domRange = ReactEditor.toDOMRange(editor, range);
  const rect = domRange.getBoundingClientRect();
  setComboboxStyle(comboboxElem, rect);
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
  const { open, onClose, onSelectItem, range, children } = props;
  const [index, setIndex] = useState(() => getIndexFromChildren(children));
  const { comboboxComponent: Component } = useComponents();
  const editor = useSlateStatic();
  const numItems = React.Children.count(children);
  const [comboboxElem, setComboboxElem] = useState<HTMLDivElement | null>(null);

  const handleArrowDownPress = (event: KeyboardEvent) => {
    event.preventDefault();
    const newIndex = index < numItems - 1 ? index + 1 : 0;
    onSelectItem?.(newIndex);
    setIndex(newIndex);
  };

  const handleArrowUpPress = (event: KeyboardEvent) => {
    event.preventDefault();
    const newIndex = index === 0 ? numItems - 1 : index - 1;
    onSelectItem?.(newIndex);
    setIndex(newIndex);
  };

  const handleTabPress = (event: KeyboardEvent) => {
    onClose(event, "tabPress", index);
  };

  const handleEnterPress = (event: KeyboardEvent) => {
    onClose(event, "enterPress", index);
  };

  const handleEscapePress = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onClose(event, "escapePress", index);
  };

  const handleSpacePress = (event: KeyboardEvent) => {
    onClose(event, "spacePress", index);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
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
  };

  const handleBlur = (event: any) => {
    onClose(event, "clickAway", index);
  };

  useEffect(() => {
    const editorRef = ReactEditor.toDOMNode(editor, editor);
    if (open) {
      editorRef.addEventListener("keydown", handleKeyDown);
      editorRef.addEventListener("blur", handleBlur);
    }
    return () => {
      editorRef.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, editor, open, onClose]);

  useEffect(() => {
    if (open) {
      setIndex(getIndexFromChildren(children));
      if (range) {
        setComboboxPositionByRange(editor, comboboxElem, range);
      } else {
        setComboboxPositionByCursor(editor, comboboxElem);
      }
    }
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
          position: "fixed",
          display: open ? "block" : "none",
        }}
        ref={setComboboxElem}
      >
        <Component ref={ref as any} data-testid="rfe-combobox">
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
