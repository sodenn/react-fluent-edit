import {
  CustomRenderElementProps,
  Mention,
  useComponents,
} from "@react-fluent-edit/core";
import { useMentionPlugin } from "../utils";

const MentionElement = ({
  attributes,
  children,
  element,
}: CustomRenderElementProps<Mention>) => {
  const plugin = useMentionPlugin();
  const { chipComponent: Chip } = useComponents();
  const Comp = plugin?.options.chipComponent || Chip;
  return (
    <Comp
      style={element.style}
      attributes={attributes}
      data-testid={`mention-${element.value.replace(" ", "-")}`}
    >
      {element.trigger}
      {element.value}
      {children}
    </Comp>
  );
};

export default MentionElement;
