import { useState, useCallback, useEffect } from "react";

export function useVisibilityToggle() {
  const [isVisible, setIsVisible] = useState(false);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "t") {
      setIsVisible((prev) => !prev);
    }
  }, []);

  const handleDoubleClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    // document.addEventListener("contextmenu", handleDoubleClick);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      // document.removeEventListener("contextmenu", handleDoubleClick);
    };
  }, [handleKeyPress, handleDoubleClick]);

  return { isVisible, setIsVisible };
}
