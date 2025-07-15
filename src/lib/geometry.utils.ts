import { CircularPosition, TaskbarOption } from "@/types/taskbar";

export function calculateCircularPositions(options: TaskbarOption[]): CircularPosition[] {
  return options.map((_, index) => {
    const angle = (index * 2 * Math.PI) / options.length - Math.PI / 2;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  });
}
