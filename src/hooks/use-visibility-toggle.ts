import { useState, useCallback, useEffect } from "react";

export function useVisibilityToggle() {
  const [isVisible, setIsVisible] = useState(false);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "t") {
      setIsVisible((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleKeyPress]);

  return { isVisible, setIsVisible };
}
