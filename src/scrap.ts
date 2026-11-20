export interface ScrapStyle {
  [k: string]: string;
}

export interface Scrap {
  style: ScrapStyle;
  cls: string;
  lower: boolean;
  tape: boolean;
}

interface FontSpec {
  css: string;
  k: number;
  lower: boolean;
  script: boolean;
}

const FONTS: ReadonlyArray<FontSpec> = [
  { css: "'Abril Fatface', serif", k: 1, lower: true, script: false },
  { css: "'Rozha One', serif", k: 0.95, lower: true, script: false },
  { css: "'DM Serif Display', serif", k: 0.95, lower: true, script: false },
  { css: "'Alfa Slab One', serif", k: 0.85, lower: true, script: false },
  { css: "'Ultra', serif", k: 0.8, lower: true, script: false },
  { css: "'Yeseva One', serif", k: 0.85, lower: true, script: false },
  { css: "'Anton', sans-serif", k: 1, lower: true, script: false },
  { css: "'Archivo Black', sans-serif", k: 0.85, lower: true, script: false },
  { css: "'Bebas Neue', sans-serif", k: 1.15, lower: false, script: false },
  { css: "'Rye', serif", k: 0.85, lower: true, script: false },
  { css: "'Righteous', sans-serif", k: 0.9, lower: true, script: false },
  { css: "'Monoton', sans-serif", k: 1.2, lower: true, script: false },
  { css: "'Special Elite', serif", k: 1.05, lower: true, script: false },
  { css: "'Pirata One', serif", k: 1, lower: true, script: false },
  { css: "'Yellowtail', cursive", k: 1.15, lower: true, script: true },
  { css: "'Lobster Two', cursive", k: 1, lower: true, script: true },
  { css: "'Kaushan Script', cursive", k: 1.1, lower: true, script: true },
];

const PALETTE = [
  '#EFE4C9', '#F4E9D0', '#D8D3C5', '#E8C87A', '#F0A8A0', '#E4D6E0',
  '#BFD8CF', '#D9B95C', '#C9A87A', '#D9A8A0', '#7FA39A', '#9FB0C4',
  '#B4674F', '#D96A4A', '#4E79A8', '#4E7A50', '#7A5A8E', '#D4AF37',
  '#D9527E', '#26272D', '#3A3E46', '#5C2320', '#1E3A4C', '#3E8E7E',
  '#C2437F', '#8C4A2F',
];

const INKS = [
  '#241E13', '#F4EFE2', '#D4AF37', '#D9527E', '#4E79A8',
  '#B4452F', '#2E5B3A', '#7A5A8E',
];

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f((n >> 16) & 255) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
}

function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

function pickInk(paper: string, rnd: () => number): string {
  const ranked = INKS.map((i) => ({ ink: i, r: contrast(i, paper) })).sort((a, b) => b.r - a.r);
  for (const min of [4.5, 3.5, 3]) {
    const pool = ranked.filter((e) => e.r >= min);
    if (pool.length > 0) return pool[Math.floor(rnd() * pool.length)].ink;
  }
  return ranked[0].ink;
}

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
  const j = (b: number, s: number) => +(b + (rnd() - 0.5) * s).toFixed(1);
  const lean = rnd() < 0.3 ? (rnd() - 0.5) * 26 : 0;
  const cut = (x: number, y: number): [number, number] => {
    if (rnd() < 0.38) {
      const k = 0.25 + rnd() * 0.34;
      x += (50 - x) * k;
      y += (50 - y) * k;
    }
    return [+x.toFixed(1), +y.toFixed(1)];
  };
  const pts: ReadonlyArray<readonly [number, number]> = [
    cut(j(-2, 10), j(-2, 11)),
    [j(30, 18) + lean, j(-3, 10)],
    [j(50, 20) + lean, j(-2, 9)],
    [j(70, 18) + lean, j(-3, 10)],
    cut(j(102, 10), j(-2, 11)),
    [j(104, 8), j(35, 20)],
    [j(104, 8), j(65, 20)],
    cut(j(102, 10), j(102, 11)),
    [j(70, 18) - lean, j(103, 10)],
    [j(50, 20) - lean, j(102, 9)],
    [j(30, 18) - lean, j(103, 10)],
    cut(j(-2, 10), j(102, 11)),
    [j(-4, 8), j(65, 20)],
    [j(-4, 8), j(35, 20)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
}

export function makeScrap(index: number, letter: string): Scrap {
  const rnd = mulberry32(index * 2654435761 + 7);
  const paper = PALETTE[Math.floor(rnd() * PALETTE.length)];
  const font = FONTS[Math.floor(rnd() * FONTS.length)];
  const lower = font.script ? true : font.lower && rnd() < 0.35;

  const shapeRoll = rnd();
  let ix: number;
  let iy: number;
  if (shapeRoll < 0.12) {
    ix = -(4 + rnd() * 3);
    iy = -(4 + rnd() * 3);
  } else if (shapeRoll < 0.6) {
    ix = -(6 + rnd() * 5);
    iy = -(6 + rnd() * 5);
  } else if (shapeRoll < 0.82) {
    ix = -(14 + rnd() * 7);
    iy = -(6 + rnd() * 5);
  } else {
    ix = -(6 + rnd() * 5);
    iy = -(14 + rnd() * 7);
  }

  const treatRoll = rnd();
  const treat = treatRoll < 0.16 ? 'outline' : treatRoll < 0.36 ? 'shadow' : treatRoll < 0.52 ? 'chip' : '';

  let ink = pickInk(paper, rnd);
  let chip = paper;
  if (treat === 'chip') {
    chip = PALETTE[Math.floor(rnd() * PALETTE.length)];
    ink = pickInk(chip, rnd);
  }

  const cls: string[] = [];
  if (treat) cls.push(`t-${treat}`);
  if (!treat || treat === 'shadow') {
    const pRoll = rnd();
    if (pRoll < 0.22) cls.push('pp-dots');
    else if (pRoll < 0.37) cls.push('pp-lines');
  }
  if (lower && letter !== letter.toLowerCase()) cls.push('is-lower');
  const tape = rnd() < 0.05;
  const fs = ((1.25 + rnd() * 0.45) * font.k).toFixed(2);
  const rotDeg = rnd() < 0.1 ? (rnd() - 0.5) * 28 : (rnd() - 0.5) * 18;

  return {
    cls: cls.join(' '),
    lower,
    tape,
    style: {
      '--paper': paper,
      '--ink': ink,
      '--clip': polygon(rnd),
      '--rot': `${rotDeg.toFixed(2)}deg`,
      '--ff': font.css,
      '--fs': `${fs}em`,
      '--ix': `${ix.toFixed(1)}%`,
      '--iy': `${iy.toFixed(1)}%`,
      '--nx': `${((rnd() - 0.5) * 20).toFixed(1)}%`,
      '--ny': `${((rnd() - 0.5) * 20).toFixed(1)}%`,
      '--shc': ink,
      '--chip': chip,
      '--off-s': (0.5 + rnd() * 0.5).toFixed(2),
      '--off-b': (0.96 + rnd() * 0.14).toFixed(2),
      '--off-o': (0.18 + rnd() * 0.12).toFixed(2),
      '--taperot': `${((rnd() - 0.5) * 24).toFixed(1)}deg`,
    },
  };
}
