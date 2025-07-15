"use client";

import { useMouseTracking } from "@/hooks/use-mouse-tracking";
import { useVisibilityToggle } from "@/hooks/use-visibility-toggle";
import { calculateCircularPositions } from "@/lib/geometry.utils";
import { StickyTaskbarProps, TaskbarOption } from "@/types/taskbar";
import React, { useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TaskbarButton } from "@/components/molecules/circular-taskbar/taskbar-button";
import { ExpandedMenu } from "@/components/molecules/circular-taskbar/expanded-menu";

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
      if (option.onClick) return option?.onClick();
      if (onClickOption) return onClickOption?.(option);
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
    <AnimatePresence mode="wait">
      {isVisible ? (
        <motion.div
          key={isVisible.toString()}
          className="fixed pointer-events-none z-50"
          data-taskbar-area="true"
          style={{
            left: mousePosition.x - 24,
            top: mousePosition.y - 24,
            transform: `scale(${isExpanded ? 1 : 0.8})`,
            transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "transform",
          }}
          exit={{ opacity: 0, scale: 0 }}
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
