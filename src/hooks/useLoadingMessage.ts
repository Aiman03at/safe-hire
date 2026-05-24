import { useState, useEffect } from "react";

export function useLoadingMessage(messages: string[], active: boolean, interval = 2800) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) { setIndex(0); return; }
    const id = setInterval(() => setIndex(i => (i + 1) % messages.length), interval);
    return () => clearInterval(id);
  }, [active, messages.length, interval]);

  return messages[index];
}
