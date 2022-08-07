import { useContext } from "react";
import { MentionsCtx } from "../MentionsProvider";

function useMentionsInternal() {
  return useContext(MentionsCtx);
}

export default useMentionsInternal;
