import { useContext } from "react";
import { MentionsCtx } from "../MentionsProvider";

function useMentions() {
  const { setMentions, ...rest } = useContext(MentionsCtx);
  return {
    ...rest,
  };
}

export default useMentions;
