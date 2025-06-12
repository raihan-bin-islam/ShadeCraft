export interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

export interface RGB {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

// Convert HSL to RGB
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  if (s === 0) {
    const gray = Math.round(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

// Convert RGB to HSL
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  const sum = max + min
  const l = sum / 2

  if (diff === 0) {
    return { h: 0, s: 0, l: l * 100 }
  }

  const s = l > 0.5 ? diff / (2 - sum) : diff / sum

  let h: number
  switch (max) {
    case r:
      h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
      break
    case g:
      h = ((b - r) / diff + 2) / 6
      break
    case b:
      h = ((r - g) / diff + 4) / 6
      break
    default:
      h = 0
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// Convert HSL to CSS string
export function hslToCss(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

// Generate complementary color (180° opposite)
export function getComplementary(hsl: HSL): HSL {
  return {
    ...hsl,
    h: (hsl.h + 180) % 360,
  }
}

// Generate triadic colors (120° apart)
export function getTriadic(hsl: HSL): [HSL, HSL] {
  return [
    { ...hsl, h: (hsl.h + 120) % 360 },
    { ...hsl, h: (hsl.h + 240) % 360 },
  ]
}

// Generate analogous colors (30° apart)
export function getAnalogous(hsl: HSL): [HSL, HSL] {
  return [
    { ...hsl, h: (hsl.h + 30) % 360 },
    { ...hsl, h: (hsl.h - 30 + 360) % 360 },
  ]
}

// Generate split-complementary colors
export function getSplitComplementary(hsl: HSL): [HSL, HSL] {
  const complement = (hsl.h + 180) % 360
  return [
    { ...hsl, h: (complement + 30) % 360 },
    { ...hsl, h: (complement - 30 + 360) % 360 },
  ]
}

// Generate tetradic/square colors (90° apart)
export function getTetradic(hsl: HSL): [HSL, HSL, HSL] {
  return [
    { ...hsl, h: (hsl.h + 90) % 360 },
    { ...hsl, h: (hsl.h + 180) % 360 },
    { ...hsl, h: (hsl.h + 270) % 360 },
  ]
}

// Create tint (lighter version)
export function createTint(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    l: Math.min(100, hsl.l + amount),
  }
}

// Create shade (darker version)
export function createShade(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    l: Math.max(0, hsl.l - amount),
  }
}

// Adjust saturation
export function adjustSaturation(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    s: Math.max(0, Math.min(100, hsl.s + amount)),
  }
}

// Calculate relative luminance for contrast checking
export function getRelativeLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255
  const gsRGB = rgb.g / 255
  const bsRGB = rgb.b / 255

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: RGB, color2: RGB): number {
  const l1 = getRelativeLuminance(color1)
  const l2 = getRelativeLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Check if contrast meets WCAG AA standards (4.5:1 for normal text)
export function hasGoodContrast(foreground: RGB, background: RGB): boolean {
  return getContrastRatio(foreground, background) >= 4.5
}
