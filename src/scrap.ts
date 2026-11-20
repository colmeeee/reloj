export interface ScrapStyle {
  '--paper': string;
  '--ink': string;
  '--clip': string;
  '--rot': string;
  '--ff': string;
  '--fs': string;
  '--ix': string;
  '--iy': string;
  '--nx': string;
  '--ny': string;
}

export interface Scrap {
  style: ScrapStyle;
  pattern: '' | 'dots' | 'lines';
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

const DARK_INK = '#241E13';
const LIGHT_INK = '#F1EBDB';

const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#D8D3C5', DARK_INK],
  ['#EFE4C9', DARK_INK],
  ['#C9A87A', DARK_INK],
  ['#D9A8A0', DARK_INK],
  ['#7FA39A', DARK_INK],
  ['#D9B95C', DARK_INK],
  ['#9FB0C4', DARK_INK],
  ['#B4674F', DARK_INK],
  ['#D4AF37', DARK_INK],
  ['#26272D', LIGHT_INK],
  ['#3A3E46', LIGHT_INK],
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
    [p(-1, 6), p(-1, 7)],
    [p(50, 18), p(-2, 7)],
    [p(101, 6), p(-1, 7)],
    [p(103, 6), p(50, 16)],
    [p(101, 6), p(101, 7)],
    [p(50, 18), p(102, 7)],
    [p(-1, 6), p(101, 7)],
    [p(-3, 6), p(50, 16)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
}

export function makeScrap(index: number): Scrap {
  const rnd = mulberry32(index * 2654435761 + 7);
  const [paper, ink] = PALETTE[Math.floor(rnd() * PALETTE.length)];
  const font = FONTS[Math.floor(rnd() * FONTS.length)];

  const shapeRoll = rnd();
  let ix: number;
  let iy: number;
  if (shapeRoll < 0.22) {
    ix = -(2 + rnd() * 2);
    iy = -(2 + rnd() * 2);
  } else if (shapeRoll < 0.72) {
    ix = -(5 + rnd() * 5);
    iy = -(5 + rnd() * 5);
  } else if (shapeRoll < 0.88) {
    ix = -(13 + rnd() * 7);
    iy = -(5 + rnd() * 4);
  } else {
    ix = -(5 + rnd() * 4);
    iy = -(13 + rnd() * 7);
  }

  const dark = ink === LIGHT_INK;
  const patternRoll = rnd();
  const pattern = dark ? '' : patternRoll < 0.24 ? 'dots' : patternRoll < 0.4 ? 'lines' : '';

  return {
    pattern,
    style: {
      '--paper': paper,
      '--ink': ink,
      '--clip': polygon(rnd),
      '--rot': `${((rnd() - 0.5) * 10).toFixed(2)}deg`,
      '--ff': font,
      '--fs': `${(0.78 + rnd() * 0.5).toFixed(2)}em`,
      '--ix': `${ix.toFixed(1)}%`,
      '--iy': `${iy.toFixed(1)}%`,
      '--nx': `${((rnd() - 0.5) * 7).toFixed(1)}%`,
      '--ny': `${((rnd() - 0.5) * 7).toFixed(1)}%`,
    },
  };
}
