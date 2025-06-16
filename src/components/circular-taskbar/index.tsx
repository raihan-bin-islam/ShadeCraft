"use client";

import { ExpandedMenu } from "@/components/circular-taskbar/expanded-menu";
import { TaskbarButton } from "@/components/circular-taskbar/taskbar-button";
import { useMouseTracking } from "@/hooks/use-mouse-tracking";
import { useVisibilityToggle } from "@/hooks/use-visibility-toggle";
import { calculateCircularPositions } from "@/lib/geometry.utils";
import { StickyTaskbarProps, TaskbarOption } from "@/types/taskbar";
import React, { useMemo, useCallback } from "react";

export const StickyTaskbar = ({
  options,
  onClickOption,
  idleTime = 1000,
  collapseDistance = 150,
  radius = 60,
  centerColor = "bg-white",
  showConnectingLines = true,
  animationDuration = 200,
}: StickyTaskbarProps) => {
  const { isVisible } = useVisibilityToggle();

  const { mousePosition, isExpanded, setIsExpanded } = useMouseTracking({
    idleTime,
    collapseDistance,
    onIdle: () => setIsExpanded(true),
    onCollapse: () => setIsExpanded(false),
  });

  const circularPositions = useMemo(() => calculateCircularPositions(options), [options]);

  const handleOptionClick = useCallback(
    (option: TaskbarOption) => {
      if (onClickOption) return onClickOption?.(option);
      if (option.onClick) return option?.onClick();
    },
    [onClickOption]
  );

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, [setIsExpanded]);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
  }, [setIsExpanded]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      data-taskbar-area="true"
      style={{
        left: mousePosition.x - 24,
        top: mousePosition.y - 24,
        transform: `scale(${isExpanded ? 1 : 0.8})`,
        transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform",
      }}
    >
      <TaskbarButton isExpanded={isExpanded} onExpand={handleExpand} />

      <ExpandedMenu
        isExpanded={isExpanded}
        options={options}
        positions={circularPositions}
        radius={radius}
        centerColor={centerColor}
        showConnectingLines={showConnectingLines}
        animationDuration={animationDuration}
        onCollapse={handleCollapse}
        onClickOption={handleOptionClick}
      />
    </div>
  );
};
