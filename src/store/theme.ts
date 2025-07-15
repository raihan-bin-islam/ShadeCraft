import { atom } from "jotai";
import type { TailwindV4Theme } from "@/types/theme-kit";

export const currentThemeAtom = atom<TailwindV4Theme>();
