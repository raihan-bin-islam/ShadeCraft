import type { LucideIcon } from "lucide-react";

export interface MousePosition {
  x: number;
  y: number;
}

export interface TaskbarOption {
  id: string;
  icon: LucideIcon;
  component?: React.ComponentType;
  label: string;
  color?: string;
  onClick?: () => void;
}

export interface StickyTaskbarProps {
  options: TaskbarOption[];
  onClickOption?: (option: TaskbarOption) => void;
  idleTime?: number;
  collapseDistance?: number;
  radius?: number;
  centerColor?: string;
  showConnectingLines?: boolean;
  maxScale?: number;
  scaleDecay?: number;
  animationDuration?: number;
}

export interface CircularPosition {
  x: number;
  y: number;
}
