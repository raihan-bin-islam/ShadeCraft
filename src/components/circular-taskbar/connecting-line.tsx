import { CircularPosition, StickyTaskbarProps } from "@/types/taskbar";
import React from "react";

interface ConnectingLinesProps extends Pick<StickyTaskbarProps, "radius" | "animationDuration"> {
  positions: CircularPosition[];
}

export const ConnectingLines = ({ positions, radius = 0, animationDuration }: ConnectingLinesProps) => {
  const centerX = (radius * 3) / 2;
  const centerY = (radius * 3) / 2;

  return (
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
      {positions.map((position, index) => (
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
              transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              opacity: 0.2,
            }}
          />
        </g>
      ))}
    </svg>
  );
};
