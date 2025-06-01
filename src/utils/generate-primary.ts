type HSL = { h: number; s: number; l: number };
type PrimaryColor = HSL & {
  hslString: string;
  hex: string;
};

const hueBuckets: [number, number][] = [
  [120, 160], // Green (natural, safe)
  [190, 230], // Blue/Teal (trustworthy, cool)
  [260, 290], // Purple (creative, modern)
  [40, 50], // Soft Yellow (playful, light accent)
];

function getRandomHue(): number {
  const [min, max] = hueBuckets[Math.floor(Math.random() * hueBuckets.length)];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))));

  return `#${f(0).toString(16).padStart(2, "0")}${f(8).toString(16).padStart(2, "0")}${f(4).toString(16).padStart(2, "0")}`;
}

export function generatePrimaryColor(): PrimaryColor {
  const h = getRandomHue();
  const s = Math.floor(Math.random() * 20) + 65; // 65–85%
  const l = Math.floor(Math.random() * 15) + 45; // 45–60%

  const hslString = `hsl(${h}, ${s}%, ${l}%)`;
  const hex = hslToHex(h, s, l);

  return { h, s, l, hslString, hex };
}
