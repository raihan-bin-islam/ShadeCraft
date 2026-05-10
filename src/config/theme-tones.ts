import { FONT_OBJECTS } from "./fonts";
import type { AxisPreferences } from "./theme-axes";

export const TONES = [
  {
    id: "minimalist",
    name: "Minimalist",
    fonts: [FONT_OBJECTS.inter, FONT_OBJECTS.ibmPlexSans, FONT_OBJECTS.beVietnamPro, FONT_OBJECTS.rubik],
    radius: "0.4rem",
    axisPreferences: {
      shadow: { flat: 4, soft: 3, elevated: 1 },
      border: { hairline: 5, standard: 2 },
      surface: { flat: 5, gradient: 1 },
      component: { solid: 4, outline: 2 },
    } as AxisPreferences,
  },
  {
    id: "brutalist",
    name: "Brutalist",
    fonts: [FONT_OBJECTS.spaceGrotesk, FONT_OBJECTS.anton, FONT_OBJECTS.bebasNeue, FONT_OBJECTS.leagueSpartan],
    radius: "0rem",
    axisPreferences: {
      shadow: { flat: 5, elevated: 2, soft: 1 },
      border: { heavy: 5, standard: 2, hairline: 0 },
      surface: { flat: 4, noise: 3, pattern: 1 },
      component: { sharp: 5, solid: 3, outline: 2 },
    } as AxisPreferences,
  },
  {
    id: "luxury",
    name: "Luxury",
    fonts: [FONT_OBJECTS.playfair, FONT_OBJECTS.cormorantGaramond, FONT_OBJECTS.merriweather, FONT_OBJECTS.lora],
    radius: "0.8rem",
    axisPreferences: {
      shadow: { soft: 4, elevated: 4, glassy: 2 },
      border: { hairline: 5, standard: 1 },
      surface: { flat: 3, gradient: 3, mesh: 2 },
      component: { embossed: 4, solid: 3, outline: 1 },
    } as AxisPreferences,
  },
  {
    id: "playful",
    name: "Playful",
    fonts: [FONT_OBJECTS.poppins, FONT_OBJECTS.inter, FONT_OBJECTS.rubik, FONT_OBJECTS.beVietnamPro],
    radius: "1rem",
    axisPreferences: {
      shadow: { soft: 4, elevated: 3, glow: 2 },
      border: { standard: 3, accented: 3 },
      surface: { gradient: 3, mesh: 3, pattern: 2 },
      component: { pill: 5, solid: 2 },
    } as AxisPreferences,
  },
  {
    id: "cyber",
    name: "Cyber",
    fonts: [FONT_OBJECTS.rajdhani, FONT_OBJECTS.rubik, FONT_OBJECTS.inter, FONT_OBJECTS.ibmPlexSans],
    radius: "0.3rem",
    axisPreferences: {
      shadow: { glow: 5, flat: 2, elevated: 1 },
      border: { accented: 4, hairline: 2 },
      surface: { mesh: 3, gradient: 3, flat: 2 },
      component: { sharp: 4, solid: 3 },
    } as AxisPreferences,
  },
  {
    id: "vintage",
    name: "Vintage",
    fonts: [FONT_OBJECTS.lora, FONT_OBJECTS.merriweather, FONT_OBJECTS.cormorantGaramond, FONT_OBJECTS.publicSans],
    radius: "0.6rem",
    axisPreferences: {
      shadow: { soft: 4, flat: 2 },
      border: { standard: 3, hairline: 2 },
      surface: { noise: 4, pattern: 2, flat: 2 },
      component: { solid: 3, outline: 2 },
    } as AxisPreferences,
  },
  {
    id: "elegant",
    name: "Elegant",
    fonts: [FONT_OBJECTS.lora, FONT_OBJECTS.playfair, FONT_OBJECTS.merriweather, FONT_OBJECTS.cormorantGaramond],
    radius: "0.7rem",
    axisPreferences: {
      shadow: { soft: 4, elevated: 2, glassy: 2 },
      border: { hairline: 5, standard: 1 },
      surface: { gradient: 3, flat: 3 },
      component: { solid: 4, outline: 2, embossed: 2 },
    } as AxisPreferences,
  },
  {
    id: "industrial",
    name: "Industrial",
    fonts: [FONT_OBJECTS.rajdhani, FONT_OBJECTS.rubik, FONT_OBJECTS.workSans, FONT_OBJECTS.ibmPlexSans],
    radius: "0.2rem",
    axisPreferences: {
      shadow: { flat: 4, soft: 2 },
      border: { heavy: 4, standard: 2 },
      surface: { flat: 4, noise: 2, pattern: 1 },
      component: { sharp: 4, solid: 3 },
    } as AxisPreferences,
  },
  {
    id: "serene",
    name: "Serene",
    fonts: [FONT_OBJECTS.publicSans, FONT_OBJECTS.lora, FONT_OBJECTS.inter, FONT_OBJECTS.ibmPlexSans],
    radius: "0.5rem",
    axisPreferences: {
      shadow: { soft: 4, flat: 3 },
      border: { hairline: 4, standard: 2 },
      surface: { gradient: 3, flat: 3, mesh: 2 },
      component: { solid: 3, pill: 2 },
    } as AxisPreferences,
  },
];
