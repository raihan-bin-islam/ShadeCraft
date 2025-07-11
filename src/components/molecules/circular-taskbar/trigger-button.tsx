import { StickyTaskbarProps } from "@/types/taskbar";
import React from "react";

interface CenterButtonProps extends Pick<StickyTaskbarProps, "centerColor"> {
  onCollapse: () => void;
}

export const TriggerButton = ({ centerColor, onCollapse }: CenterButtonProps) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
  };

  return (
    <div
      className={`absolute top-1/2 left-1/2 w-8 h-8 ${centerColor} rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer z-10`}
      style={{
        transform: "translate3d(-50%, -50%, 0)",
        transition: "box-shadow 200ms ease",
        willChange: "box-shadow",
      }}
      onClick={onCollapse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-2 h-2 bg-gray-400 rounded-full" />
    </div>
  );
};
