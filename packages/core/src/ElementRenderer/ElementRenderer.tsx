import { RenderElementProps } from "slate-react";
import usePlugins from "../usePlugins";

const ElementRenderer = (props: RenderElementProps) => {
  const { attributes, children } = props;

  const plugins = usePlugins();

  const plugin = plugins
    .map((plugin) => plugin.element)
    .find(({ match }) => match(props));

  if (plugin) {
    const Component = plugin.component;
    return <Component {...props} />;
  }

  return (
    <p style={{ margin: 0, padding: 0 }} {...attributes}>
      {children}
    </p>
  );
};

export default ElementRenderer;
