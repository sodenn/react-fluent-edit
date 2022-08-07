import { renderHook } from "@testing-library/react";
import { FocusEvent, MouseEvent } from "react";
import { createEditor } from "slate";
import PluginProvider from "../PluginProvider";
import { Plugin, WithChildrenProp } from "../types";
import useEventHandler from "./useEventHandler";

describe("useEventHandler", () => {
  it("should call all event listeners in the correct order", () => {
    const listener1 = jest.fn().mockImplementation(() => false);
    const listener2 = jest.fn().mockImplementation(() => true);
    const listener3 = jest.fn().mockImplementation(() => false);
    const listener4 = jest.fn().mockImplementation(() => false);

    const plugins: Plugin[] = [
      {
        name: "1",
        handlers: {
          onClick: { handler: listener1 },
          onBlur: { handler: listener4 },
        },
      },
      {
        name: "2",
        handlers: {
          onClick: { handler: listener2, priority: 1000 },
        },
      },
      {
        name: "3",
        handlers: {
          onClick: { handler: listener3, priority: 3000 },
        },
      },
    ];

    const wrapper = ({ children }: WithChildrenProp) => (
      <PluginProvider plugins={plugins}>{children}</PluginProvider>
    );

    const {
      result: {
        current: { onClick, onBlur },
      },
    } = renderHook(() => useEventHandler(createEditor()), { wrapper });

    onClick?.({} as MouseEvent<HTMLDivElement>);
    onBlur?.({} as FocusEvent<HTMLDivElement>);

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
    expect(listener3).toHaveBeenCalled();
    expect(listener4).toHaveBeenCalled();
  });
});
