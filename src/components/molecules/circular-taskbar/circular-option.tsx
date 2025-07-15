import React from "react";
import type { TaskbarOption, CircularPosition, StickyTaskbarProps } from "@/types/taskbar";
import { cn } from "@/lib/utils";

interface CircularOptionProps extends Pick<StickyTaskbarProps, "radius" | "animationDuration" | "onClickOption"> {
  option: TaskbarOption;
  position: CircularPosition;
  index: number;
  isExpanded: boolean;
}

export const CircularOption = ({
  option,
  position,
  radius = 0,
  index,
  isExpanded,
  animationDuration,
  onClickOption,
}: CircularOptionProps) => {
  const Icon = option.icon;

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate3d(calc(-50% + ${position.x * radius}px), calc(-50% + ${position.y * radius}px), 0)`,
        transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: isExpanded ? `${index * 30}ms` : "0ms",
        zIndex: 10,
        willChange: "transform",
      }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full shadow-lg flex items-center justify-center cursor-pointer",
          "bg-accent border hover:bg-border"
        )}
        style={{
          transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow ${animationDuration}ms ease, background-color ${animationDuration}ms ease`,
          willChange: "transform, box-shadow, background-color",
        }}
        onClick={() => onClickOption?.(option)}
        title={option.label}
      >
        <Icon
          className="text-foreground"
          size={20}
          style={{
            transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
};
