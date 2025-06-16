import React from "react";

interface TaskbarButtonProps {
  isExpanded: boolean;
  onExpand: () => void;
}

export function TaskbarButton({ isExpanded, onExpand }: TaskbarButtonProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
  };

  return (
    <div
      className={`relative ${isExpanded ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
      style={{
        transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, opacity",
      }}
    >
      <div
        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer"
        onClick={onExpand}
        style={{
          transition: "box-shadow 200ms ease",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  );
}
