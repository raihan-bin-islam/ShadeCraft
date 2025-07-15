"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { LucideIcon } from "lucide-react";

interface MousePosition {
  x: number;
  y: number;
}

interface TaskbarOption {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick?: () => void;
}

interface StickyTaskbarProps {
  options: TaskbarOption[];
  idleTime?: number;
  collapseDistance?: number;
  radius?: number;
  centerColor?: string;
  showConnectingLines?: boolean;
  maxScale?: number;
  scaleDecay?: number;
  animationDuration?: string;
}

export function StickyTaskbar({
  options,
  idleTime = 1000,
  collapseDistance = 150,
  radius = 60,
  centerColor = "bg-white",
  showConnectingLines = true,
  animationDuration = "0ms",
}: StickyTaskbarProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Memoize circular positions
  const circularPositions = useMemo(() => {
    return options.map((_, index) => {
      const angle = (index * 2 * Math.PI) / options.length - Math.PI / 2;
      return {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
    });
  }, [options]);

  const startIdleTimer = useCallback(() => {
    // Clear existing timer
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // Start new idle timer
    idleTimeoutRef.current = setTimeout(() => {
      console.log("Mouse idle - opening taskbar");
      setIsExpanded(true);
    }, idleTime);
  }, [idleTime]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Only update position when taskbar is NOT expanded
      if (!isExpanded) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        // setIsVisible(true);
        // Restart the idle timer since mouse moved
        startIdleTimer();
      } else {
        // When expanded, check if mouse moved far enough to collapse
        const distance = Math.sqrt(Math.pow(e.clientX - mousePosition.x, 2) + Math.pow(e.clientY - mousePosition.y, 2));

        if (distance > collapseDistance) {
          setIsExpanded(false);
          // Resume following mouse after collapse
          setMousePosition({ x: e.clientX, y: e.clientY });
          startIdleTimer();
        }
      }
    },
    [isExpanded, mousePosition.x, mousePosition.y, collapseDistance, startIdleTimer]
  );

  const handleMouseLeave = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    setIsExpanded(false);
    setIsVisible(false);
  }, []);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (isExpanded) {
        const distance = Math.sqrt(Math.pow(e.clientX - mousePosition.x, 2) + Math.pow(e.clientY - mousePosition.y, 2));

        if (distance > 100) {
          setIsExpanded(false);
          // Resume following mouse after collapse
          setMousePosition({ x: e.clientX, y: e.clientY });
          startIdleTimer();
        }
      }
    },
    [isExpanded, mousePosition.x, mousePosition.y, startIdleTimer]
  );

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "t") {
      setIsVisible((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keypress", handleKeyPress);

    // Start initial idle timer
    startIdleTimer();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keypress", handleKeyPress);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, handleClickOutside, handleKeyPress, startIdleTimer]);

  const handleOptionClick = useCallback((option: TaskbarOption) => {
    if (option.onClick) {
      option.onClick();
    } else {
      console.log(`Clicked: ${option.label}`);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      data-taskbar-area="true"
      style={{
        left: mousePosition.x - 24,
        top: mousePosition.y - 24,
        transform: `scale(${isExpanded ? 1 : 0.8})`,
        transition: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: "transform",
      }}
    >
      {/* Main taskbar button */}
      <div
        className={`relative ${isExpanded ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
        style={{
          transition: `all 500ms cubic-bezier(0.4, 0, 0.2, 1)`,
          willChange: "transform, opacity",
        }}
      >
        <div
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer"
          onClick={() => setIsExpanded(true)}
          style={{
            transition: "box-shadow 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      {/* Expanded circular menu */}
      <div
        className={`absolute inset-0 ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        style={{
          transition: `all 500ms cubic-bezier(0.4, 0, 0.2, 1)`,
          willChange: "transform, opacity",
        }}
      >
        {/* Center button */}
        <div
          className={`absolute top-1/2 left-1/2 w-8 h-8 ${centerColor} rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer z-10`}
          style={{
            transform: "translate3d(-50%, -50%, 0)",
            transition: "box-shadow 200ms ease",
            willChange: "box-shadow",
          }}
          onClick={() => {
            setIsExpanded(false);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        </div>

        {/* Connecting lines */}
        {showConnectingLines && (
          <svg
            className="absolute top-1/2 left-1/2 pointer-events-auto"
            width={radius * 3}
            height={radius * 3}
            style={{
              transform: "translate3d(-50%, -50%, 0)",
              opacity: 0.2,
              willChange: "opacity",
            }}
          >
            {options.map((_, index) => {
              const position = circularPositions[index];
              const centerX = (radius * 3) / 2;
              const centerY = (radius * 3) / 2;

              return (
                <g key={index}>
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={centerX + position.x * radius}
                    y2={centerY + position.y * radius}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-foreground pointer-events-none"
                    style={{
                      transition: `all ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
                      opacity: 0.2,
                    }}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Circular options */}
        {options.map((option, index) => {
          const position = circularPositions[index];
          const Icon = option.icon;

          return (
            <div
              key={`${option.label}-${index}`}
              className="absolute pointer-events-auto"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate3d(calc(-50% + ${position.x * radius}px), calc(-50% + ${position.y * radius}px), 0)`,
                transition: `transform ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
                transitionDelay: isExpanded ? `${index * 30}ms` : "0ms",
                zIndex: 10,
                willChange: "transform",
              }}
            >
              <div
                className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center cursor-pointer ${option.color}`}
                style={{
                  transition: `transform ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1), box-shadow ${animationDuration} ease`,
                  willChange: "transform, box-shadow",
                }}
                onClick={() => handleOptionClick(option)}
                title={option.label}
              >
                <Icon
                  className="text-white"
                  size={20}
                  style={{
                    transition: `all ${animationDuration} cubic-bezier(0.4, 0, 0.2, 1)`,
                    willChange: "transform",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
