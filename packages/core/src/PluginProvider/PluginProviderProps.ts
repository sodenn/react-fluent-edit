import type { Plugin, WithChildrenProp } from "../types";

interface PluginProviderProps extends WithChildrenProp {
  plugins?: Plugin[];
}

export type { PluginProviderProps };
