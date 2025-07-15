import { MousePosition } from "@/types/taskbar";
import { useState, useCallback, useRef, useEffect } from "react";

interface UseMouseTrackingProps {
  idleTime: number;
  collapseDistance: number;
  onIdle: () => void;
  onCollapse: () => void;
}

export function useMouseTracking({ idleTime, collapseDistance, onIdle, onCollapse }: UseMouseTrackingProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const startIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      console.log("Mouse idle - opening taskbar");
      onIdle();
    }, idleTime);
  }, [idleTime, onIdle]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isExpanded) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        startIdleTimer();
      } else {
        const distance = Math.sqrt(Math.pow(e.clientX - mousePosition.x, 2) + Math.pow(e.clientY - mousePosition.y, 2));

        if (distance > collapseDistance) {
          onCollapse();
          setMousePosition({ x: e.clientX, y: e.clientY });
          startIdleTimer();
        }
      }
    },
    [isExpanded, mousePosition, collapseDistance, startIdleTimer, onCollapse]
  );

  const handleMouseLeave = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    onCollapse();
  }, [onCollapse]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (isExpanded) {
        const distance = Math.sqrt(Math.pow(e.clientX - mousePosition.x, 2) + Math.pow(e.clientY - mousePosition.y, 2));

        if (distance > 100) {
          onCollapse();
          setMousePosition({ x: e.clientX, y: e.clientY });
          startIdleTimer();
        }
      }
    },
    [isExpanded, mousePosition, startIdleTimer, onCollapse]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClickOutside);
    startIdleTimer();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClickOutside);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, handleClickOutside, startIdleTimer]);

  return {
    mousePosition,
    isExpanded,
    setIsExpanded,
    startIdleTimer,
  };
}
