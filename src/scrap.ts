export interface ScrapStyle {
  '--paper': string;
  '--ink': string;
  '--clip': string;
  '--rot': string;
  '--ff': string;
  '--fs': string;
}

const FONTS = [
  "'Abril Fatface', serif",
  "'Alfa Slab One', serif",
  "'Anton', sans-serif",
  "'Archivo Black', sans-serif",
  "'Bebas Neue', sans-serif",
  "'Playfair Display', serif",
  "'Space Mono', monospace",
  "'Ultra', serif",
];

const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#D4AF37', '#1A1206'],
  ['#E2582C', '#200B04'],
  ['#2E8C86', '#F3F0E2'],
  ['#2C3A55', '#F2E9D5'],
  ['#F1E4C3', '#272216'],
  ['#DE8E97', '#2B1114'],
  ['#7C8A4E', '#F5F2E2'],
  ['#8FB4D9', '#14212E'],
  ['#E8A13B', '#221203'],
  ['#5B7DB1', '#F0EDE0'],
];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polygon(rnd: () => number): string {
  const p = (base: number, spread: number) => +(base + (rnd() - 0.5) * spread).toFixed(1);
  const pts: ReadonlyArray<readonly [number, number]> = [
    [p(-2, 8), p(-3, 9)],
    [p(50, 22), p(-4, 8)],
    [p(102, 8), p(-3, 9)],
    [p(104, 7), p(50, 20)],
    [p(102, 8), p(103, 9)],
    [p(50, 22), p(104, 8)],
    [p(-2, 8), p(103, 9)],
    [p(-4, 7), p(50, 20)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
}

export function makeScrap(index: number): ScrapStyle {
  const rnd = mulberry32(index * 2654435761 + 7);
  const [paper, ink] = PALETTE[Math.floor(rnd() * PALETTE.length)];
  const font = FONTS[Math.floor(rnd() * FONTS.length)];
  return {
    '--paper': paper,
    '--ink': ink,
    '--clip': polygon(rnd),
    '--rot': `${((rnd() - 0.5) * 9).toFixed(2)}deg`,
    '--ff': font,
    '--fs': `${(0.86 + rnd() * 0.32).toFixed(2)}em`,
  };
}
