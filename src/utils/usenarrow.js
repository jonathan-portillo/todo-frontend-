import { useEffect, useState } from "react";

const QUERY = "(max-width: 40rem)";

// True on phone-sized screens, where the board stacks into one column.
export const useNarrow = () => {
  const [narrow, setNarrow] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return narrow;
};
