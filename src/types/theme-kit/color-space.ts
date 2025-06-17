export interface OKLCH {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
  a?: number; // Alpha (0-1)
}

export interface HSL {
  h: number; // Hue angle [0..360)
  s: number; // Saturation [0..1]
  l: number; // Lightness [0..1]
  a?: number; // Optional alpha [0..1]
}

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}
