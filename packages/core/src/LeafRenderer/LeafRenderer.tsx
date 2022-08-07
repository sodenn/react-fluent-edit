import { CSSProperties } from "react";
import { RenderLeafProps } from "slate-react";
import { Leaf, LeafComponent } from "../types";
import usePlugins from "../usePlugins";

function isLeafComponent(item: Leaf): item is LeafComponent {
  return !!Object.getOwnPropertyDescriptor(item, "component");
}

const LeafRenderer = (props: RenderLeafProps) => {
  const { attributes, children } = props;

  const plugins = usePlugins();

  const plugin = plugins
    .flatMap((plugin) => plugin.leaves)
    .sort((l1, l2) => (l2.priority || 0) - (l1.priority || 0))
    .find(({ match }) => match(props));

  let style: CSSProperties | undefined = undefined;

  if (plugin) {
    if (isLeafComponent(plugin)) {
      const Component = plugin.component;
      return <Component {...props} />;
    } else {
      style = plugin.style;
    }
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

export default LeafRenderer;
