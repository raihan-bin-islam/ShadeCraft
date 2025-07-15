import { Eye, Palette, Wand2 } from "lucide-react";

export const taskbarOptions = [
  {
    id: "generator",
    icon: Wand2,
    label: "Generator",
    color: "bg-slate-400 hover:bg-purple-600",
    onClick: () => alert("Generator clicked!"),
  },
  {
    id: "themes",
    icon: Eye,
    label: "Themes",
    color: "bg-slate-400 hover:bg-indigo-600",
    onClick: () => alert("Themes clicked!"),
  },
  {
    id: "brand-input",
    icon: Palette,
    label: "Brand Colors",
    color: "bg-slate-400 hover:bg-pink-600",
    onClick: () => alert("Brand Colors clicked!"),
  },
  // {
  //   id: "editor",
  //   icon: Edit3,
  //   label: "Editor",
  //   color: "bg-slate-400 hover:bg-green-600",
  //   onClick: () => alert("Editor clicked!"),
  //   disabled: true,
  // },
  // {
  //   id: "analyzer",
  //   icon: Search,
  //   label: "Analyzer",
  //   color: "bg-slate-400 hover:bg-yellow-600",
  //   onClick: () => alert("Analyzer clicked!"),
  // },
  // {
  //   id: "comparison",
  //   icon: GitCompare,
  //   label: "HSL vs OKLCH",
  //   color: "bg-slate-400 hover:bg-blue-600",
  //   onClick: () => alert("Comparison clicked!"),
  // },
] as const;
export type TaskbarItem = (typeof taskbarOptions)[number];
export type TaskbarItemId = TaskbarItem["id"];
