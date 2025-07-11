import React from "react";

interface TaskbarButtonProps {
  isExpanded: boolean;
  onExpand: () => void;
}

export function TaskbarButton({ isExpanded, onExpand }: TaskbarButtonProps) {
  return (
    <div
      className={`relative ${isExpanded ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
      style={{
        transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "transform, opacity",
      }}
    >
      <div
        className="w-12 h-12 bg-slate-200 rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer"
        onClick={onExpand}
        style={{
          transition: "box-shadow 200ms ease",
        }}
      >
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  );
}
