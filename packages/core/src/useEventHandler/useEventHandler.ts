import { useMemo } from "react";
import { Editor } from "slate";
import { EventHandlers } from "../types";
import usePlugins from "../usePlugins";
import { UseEventHandlersProps } from "./useEventHandlerProps";

function useEventHandler(editor: Editor): Partial<UseEventHandlersProps> {
  const plugins = usePlugins();

  const events = plugins
    .map((p) => p.handlers)
    .flatMap((h) =>
      Object.entries(h).map(([key, value]) => ({
        name: key as keyof EventHandlers,
        priority: value.priority,
        handler: value.handler,
      }))
    )
    .sort((e1, e2) => (e2.priority || 0) - (e1.priority || 0));

  return useMemo(
    () =>
      events.reduce<Partial<UseEventHandlersProps>>(
        (prev, { name, handler }) => {
          const prevListener = prev[name];
          if (prevListener) {
            prev[name] = (ev: any) => {
              const handled = prevListener(ev);
              if (!handled) {
                return handler(ev, editor);
              }
              return handled;
            };
            return prev;
          } else {
            return {
              ...prev,
              [name]: (ev: any) => handler(ev, editor),
            };
          }
        },
        {}
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plugins, editor]
  );
}

export default useEventHandler;
