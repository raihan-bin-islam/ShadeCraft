import { CircularOption } from "@/components/circular-taskbar/circular-option";
import { ConnectingLines } from "@/components/circular-taskbar/connecting-line";
import { TriggerButton } from "@/components/circular-taskbar/trigger-button";
import { CircularPosition, StickyTaskbarProps } from "@/types/taskbar";
import React from "react";

interface ExpandedMenuProps extends StickyTaskbarProps {
  isExpanded: boolean;
  positions: CircularPosition[];
  onCollapse: () => void;
}

export function ExpandedMenu({
  isExpanded,
  options,
  positions,
  radius,
  centerColor,
  showConnectingLines,
  animationDuration,
  onCollapse,
  onClickOption,
}: ExpandedMenuProps) {
  return (
    <div
      className={`absolute inset-0 ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
      style={{
        transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, opacity",
      }}
    >
      <TriggerButton centerColor={centerColor} onCollapse={onCollapse} />

      {showConnectingLines && <ConnectingLines positions={positions} radius={radius} animationDuration={animationDuration} />}

      {options.map((option, index) => (
        <CircularOption
          key={`${option.label}-${index}`}
          option={option}
          position={positions[index]}
          radius={radius}
          index={index}
          isExpanded={isExpanded}
          animationDuration={animationDuration}
          onClickOption={onClickOption}
        />
      ))}
    </div>
  );
}
