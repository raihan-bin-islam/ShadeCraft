import {
  type HSL,
  hslToCss,
  getComplementary,
  getTriadic,
  getAnalogous,
  getSplitComplementary,
  getTetradic,
  createTint,
  createShade,
  adjustSaturation,
  hslToRgb,
} from "./color-theory"
import {
  hslToOklch,
  convertThemeToOklch,
  generateOklchChartColors,
  generateOklchSidebarColors,
} from "./oklch-converter"
import { generateForegroundColor, ensureContrast, generateContrastPair } from "./contrast-utils"

export interface GeneratedTheme {
  name: string
  description: string
  feel: string
  cssVars: {
    light: Record<string, string>
    dark: Record<string, string>
  }
  oklchVars: {
    light: Record<string, string>
    dark: Record<string, string>
  }
  previewColors: {
    primary: string
    secondary: string
    accent: string
    lightBg: string
    darkBg: string
  }
}

// Color harmony types
type ColorHarmony = "complementary" | "triadic" | "analogous" | "splitComplementary" | "tetradic" | "monochromatic"

// Theme feels and their characteristics
const THEME_FEELS = [
  {
    name: "Ethereal",
    description: "Mystical and dreamy with soft, otherworldly colors",
    saturationRange: [40, 70],
    lightnessRange: [45, 75],
    preferredHues: [240, 280, 320, 200], // Blues, purples, magentas, cyans
  },
  {
    name: "Vibrant",
    description: "Bold and energetic with high-contrast colors",
    saturationRange: [70, 90],
    lightnessRange: [40, 65],
    preferredHues: [0, 30, 120, 240], // Reds, oranges, greens, blues
  },
  {
    name: "Serene",
    description: "Calm and peaceful with muted, sophisticated tones",
    saturationRange: [20, 50],
    lightnessRange: [35, 70],
    preferredHues: [200, 220, 180, 160], // Blues, blue-grays, teals
  },
  {
    name: "Warm",
    description: "Cozy and inviting with earth-toned colors",
    saturationRange: [50, 80],
    lightnessRange: [40, 70],
    preferredHues: [20, 40, 60, 300], // Oranges, yellows, browns, magentas
  },
  {
    name: "Cool",
    description: "Fresh and modern with cool-toned colors",
    saturationRange: [40, 75],
    lightnessRange: [45, 75],
    preferredHues: [180, 200, 240, 280], // Cyans, blues, purples
  },
  {
    name: "Elegant",
    description: "Sophisticated and refined with rich, deep colors",
    saturationRange: [30, 60],
    lightnessRange: [25, 55],
    preferredHues: [260, 280, 20, 340], // Purples, browns, deep reds
  },
  {
    name: "Playful",
    description: "Fun and cheerful with bright, happy colors",
    saturationRange: [60, 85],
    lightnessRange: [50, 80],
    preferredHues: [300, 60, 120, 200], // Pinks, yellows, greens, blues
  },
  {
    name: "Minimalist",
    description: "Clean and simple with subtle, understated colors",
    saturationRange: [10, 40],
    lightnessRange: [40, 80],
    preferredHues: [0, 220, 180, 60], // Grays, blues, teals, yellows
  },
]

// Generate a random number within a range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Pick a random element from an array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate a base color based on theme feel
function generateBaseColor(feel: (typeof THEME_FEELS)[0]): HSL {
  const hue = randomChoice(feel.preferredHues) + randomInRange(-20, 20) // Add some variation
  const saturation = randomInRange(feel.saturationRange[0], feel.saturationRange[1])
  const lightness = randomInRange(feel.lightnessRange[0], feel.lightnessRange[1])

  return {
    h: (hue + 360) % 360, // Ensure positive
    s: Math.max(0, Math.min(100, saturation)),
    l: Math.max(0, Math.min(100, lightness)),
  }
}

// Generate color palette based on harmony type
function generateColorPalette(baseColor: HSL, harmony: ColorHarmony): HSL[] {
  switch (harmony) {
    case "complementary":
      return [baseColor, getComplementary(baseColor)]

    case "triadic":
      return [baseColor, ...getTriadic(baseColor)]

    case "analogous":
      return [baseColor, ...getAnalogous(baseColor)]

    case "splitComplementary":
      return [baseColor, ...getSplitComplementary(baseColor)]

    case "tetradic":
      return [baseColor, ...getTetradic(baseColor)]

    case "monochromatic":
      return [
        baseColor,
        adjustSaturation(createShade(baseColor, 15), -10),
        adjustSaturation(createTint(baseColor, 20), 15),
      ]

    default:
      return [baseColor, getComplementary(baseColor)]
  }
}

// Generate background colors based on primary color
function generateBackgrounds(
  primaryColor: HSL,
  isLight: boolean,
): {
  background: string
  card: string
  muted: string
  border: string
  input: string
} {
  if (isLight) {
    // Light mode backgrounds
    const bgTint = createTint(adjustSaturation(primaryColor, -40), 45) // Very light, desaturated
    const cardTint = createTint(adjustSaturation(primaryColor, -45), 50) // Even lighter
    const mutedTint = createTint(adjustSaturation(primaryColor, -35), 35) // Slightly more saturated
    const borderTint = createTint(adjustSaturation(primaryColor, -30), 25)
    const inputTint = createTint(adjustSaturation(primaryColor, -35), 30)

    return {
      background: hslToCss({ ...bgTint, l: Math.max(95, bgTint.l) }),
      card: hslToCss({ ...cardTint, l: Math.max(97, cardTint.l) }),
      muted: hslToCss({ ...mutedTint, l: Math.max(90, mutedTint.l) }),
      border: hslToCss({ ...borderTint, l: Math.max(85, borderTint.l) }),
      input: hslToCss({ ...inputTint, l: Math.max(88, inputTint.l) }),
    }
  } else {
    // Dark mode backgrounds
    const bgShade = createShade(adjustSaturation(primaryColor, -20), 40) // Dark, less saturated
    const cardShade = createShade(adjustSaturation(primaryColor, -25), 35) // Slightly lighter
    const mutedShade = createShade(adjustSaturation(primaryColor, -15), 45) // Darker
    const borderShade = createShade(adjustSaturation(primaryColor, -10), 35)
    const inputShade = createShade(adjustSaturation(primaryColor, -15), 35)

    return {
      background: hslToCss({ ...bgShade, l: Math.min(12, bgShade.l) }),
      card: hslToCss({ ...cardShade, l: Math.min(16, cardShade.l) }),
      muted: hslToCss({ ...mutedShade, l: Math.min(18, mutedShade.l) }),
      border: hslToCss({ ...borderShade, l: Math.min(20, borderShade.l) }),
      input: hslToCss({ ...inputShade, l: Math.min(20, inputShade.l) }),
    }
  }
}

// Ensure color has good contrast for text
function ensureTextContrast(color: HSL, isDark: boolean): HSL {
  const targetLightness = isDark ? 85 : 15 // Light text on dark bg, dark text on light bg
  return { ...color, l: targetLightness }
}

// Generate a complete theme
export function generateRandomTheme(): GeneratedTheme {
  // Pick random theme feel and harmony
  const feel = randomChoice(THEME_FEELS)
  const harmony = randomChoice<ColorHarmony>([
    "complementary",
    "triadic",
    "analogous",
    "splitComplementary",
    "tetradic",
    "monochromatic",
  ])

  // Generate base color and palette
  const baseColor = generateBaseColor(feel)
  const palette = generateColorPalette(baseColor, harmony)

  // Assign colors to roles
  const primary = palette[0]
  const secondary = palette[1] || adjustSaturation(createTint(primary, 20), -15)
  const accent = palette[2] || adjustSaturation(createShade(primary, 10), 10)

  // Generate theme name
  const colorNames = ["Crimson", "Azure", "Emerald", "Amber", "Violet", "Coral", "Teal", "Rose", "Sage", "Indigo"]
  const suffixes = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"]
  const themeName = `${randomChoice(colorNames)} ${randomChoice(suffixes)}`

  // Generate backgrounds
  const lightBgs = generateBackgrounds(primary, true)
  const darkBgs = generateBackgrounds(primary, false)

  // Generate proper foreground colors with contrast checking
  const lightForeground = generateForegroundColor({ h: primary.h, s: 10, l: 97 }) // Light background
  const darkForeground = generateForegroundColor({ h: primary.h, s: 20, l: 8 }) // Dark background

  // Generate contrast-aware color pairs
  const primaryPair = generateContrastPair(primary)
  const secondaryPair = generateContrastPair(secondary)
  const accentPair = generateContrastPair(accent)

  // Parse background HSL values for foreground calculation
  const parseHslString = (hslStr: string): HSL => {
    const parts = hslStr.split(/\s+/)
    return {
      h: Number.parseFloat(parts[0]),
      s: Number.parseFloat(parts[1].replace("%", "")),
      l: Number.parseFloat(parts[2].replace("%", "")),
    }
  }

  const lightBgHsl = parseHslString(lightBgs.background)
  const lightCardHsl = parseHslString(lightBgs.card)
  const lightMutedHsl = parseHslString(lightBgs.muted)

  const darkBgHsl = parseHslString(darkBgs.background)
  const darkCardHsl = parseHslString(darkBgs.card)
  const darkMutedHsl = parseHslString(darkBgs.muted)

  // Create CSS variables (HSL format) with proper contrast
  const lightVars = {
    background: lightBgs.background,
    foreground: hslToCss(generateForegroundColor(lightBgHsl)),
    card: lightBgs.card,
    "card-foreground": hslToCss(generateForegroundColor(lightCardHsl)),
    popover: lightBgs.card,
    "popover-foreground": hslToCss(generateForegroundColor(lightCardHsl)),
    primary: hslToCss(primaryPair.background),
    "primary-foreground": hslToCss(primaryPair.foreground),
    secondary: hslToCss(secondaryPair.background),
    "secondary-foreground": hslToCss(secondaryPair.foreground),
    muted: lightBgs.muted,
    "muted-foreground": hslToCss(generateForegroundColor(lightMutedHsl)),
    accent: hslToCss(accentPair.background),
    "accent-foreground": hslToCss(accentPair.foreground),
    destructive: "0 84% 60%",
    "destructive-foreground": hslToCss(generateForegroundColor({ h: 0, s: 84, l: 60 })),
    border: lightBgs.border,
    input: lightBgs.input,
    ring: hslToCss(primary),
  }

  const darkVars = {
    background: darkBgs.background,
    foreground: hslToCss(generateForegroundColor(darkBgHsl)),
    card: darkBgs.card,
    "card-foreground": hslToCss(generateForegroundColor(darkCardHsl)),
    popover: darkBgs.card,
    "popover-foreground": hslToCss(generateForegroundColor(darkCardHsl)),
    primary: hslToCss(createTint(primaryPair.background, 10)),
    "primary-foreground": hslToCss(ensureContrast(primaryPair.foreground, createTint(primaryPair.background, 10))),
    secondary: hslToCss(createTint(secondaryPair.background, 15)),
    "secondary-foreground": hslToCss(
      ensureContrast(secondaryPair.foreground, createTint(secondaryPair.background, 15)),
    ),
    muted: darkBgs.muted,
    "muted-foreground": hslToCss(generateForegroundColor(darkMutedHsl)),
    accent: hslToCss(createTint(accentPair.background, 15)),
    "accent-foreground": hslToCss(ensureContrast(accentPair.foreground, createTint(accentPair.background, 15))),
    destructive: "0 84% 65%",
    "destructive-foreground": hslToCss(generateForegroundColor({ h: 0, s: 84, l: 65 })),
    border: darkBgs.border,
    input: darkBgs.input,
    ring: hslToCss(createTint(primary, 10)),
  }

  // Convert to OKLCH format
  const oklchLightVars = convertThemeToOklch(lightVars)
  const oklchDarkVars = convertThemeToOklch(darkVars)

  // Add chart colors in OKLCH
  const primaryOklch = hslToOklch(primary)
  const chartColors = generateOklchChartColors(primaryOklch)
  Object.assign(oklchLightVars, chartColors)
  Object.assign(oklchDarkVars, chartColors)

  // Add sidebar colors in OKLCH
  const backgroundOklch = hslToOklch(lightBgHsl)
  const foregroundOklch = hslToOklch(generateForegroundColor(lightBgHsl))
  const accentOklch = hslToOklch(accent)
  const borderOklch = hslToOklch(parseHslString(lightBgs.border))

  const sidebarColors = generateOklchSidebarColors(
    backgroundOklch,
    foregroundOklch,
    primaryOklch,
    accentOklch,
    borderOklch,
  )
  Object.assign(oklchLightVars, sidebarColors)

  // Dark mode sidebar colors
  const darkBackgroundOklch = hslToOklch(darkBgHsl)
  const darkForegroundOklch = hslToOklch(generateForegroundColor(darkBgHsl))
  const darkBorderOklch = hslToOklch(parseHslString(darkBgs.border))

  const darkSidebarColors = generateOklchSidebarColors(
    darkBackgroundOklch,
    darkForegroundOklch,
    primaryOklch,
    accentOklch,
    darkBorderOklch,
  )
  Object.assign(oklchDarkVars, darkSidebarColors)

  // Generate preview colors for the theme switcher
  const primaryRgb = hslToRgb(primary)
  const secondaryRgb = hslToRgb(secondary)
  const accentRgb = hslToRgb(accent)
  const lightBgRgb = hslToRgb(lightBgHsl)
  const darkBgRgb = hslToRgb(darkBgHsl)

  return {
    name: themeName,
    description: feel.description,
    feel: feel.name,
    cssVars: {
      light: lightVars,
      dark: darkVars,
    },
    oklchVars: {
      light: oklchLightVars,
      dark: oklchDarkVars,
    },
    previewColors: {
      primary: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
      secondary: `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`,
      accent: `rgb(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b})`,
      lightBg: `rgb(${lightBgRgb.r}, ${lightBgRgb.g}, ${lightBgRgb.b})`,
      darkBg: `rgb(${darkBgRgb.r}, ${darkBgRgb.g}, ${darkBgRgb.b})`,
    },
  }
}

// Generate multiple themes at once
export function generateThemeCollection(count = 5): GeneratedTheme[] {
  const themes: GeneratedTheme[] = []
  const usedFeels = new Set<string>()

  for (let i = 0; i < count; i++) {
    let theme = generateRandomTheme()

    // Try to avoid duplicate feels in the same collection
    let attempts = 0
    while (usedFeels.has(theme.feel) && attempts < 10) {
      theme = generateRandomTheme()
      attempts++
    }

    usedFeels.add(theme.feel)
    themes.push(theme)
  }

  return themes
}
