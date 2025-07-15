import { auroraTheme } from "./aurora"
import { sereneTheme } from "./serene"
import { tropicalTheme } from "./tropical"
import { midnightTheme } from "./midnight"
import { candyTheme } from "./candy"

export const themes = {
  aurora: auroraTheme,
  serene: sereneTheme,
  tropical: tropicalTheme,
  midnight: midnightTheme,
  candy: candyTheme,
}

export type ThemeName = keyof typeof themes
