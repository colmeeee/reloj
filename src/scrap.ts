export interface ScrapStyle {
  [k: string]: string;
}

export interface Scrap {
  style: ScrapStyle;
  cls: string;
}

const FONTS = [
  "'Abril Fatface', serif",
  "'Rozha One', serif",
  "'DM Serif Display', serif",
  "'Alfa Slab One', serif",
  "'Ultra', serif",
  "'Yeseva One', serif",
  "'Anton', sans-serif",
  "'Archivo Black', sans-serif",
  "'Bebas Neue', sans-serif",
  "'Rye', serif",
  "'Righteous', sans-serif",
  "'Monoton', sans-serif",
  "'Special Elite', serif",
  "'Pirata One', serif",
];

const PALETTE = [
  '#EFE4C9', '#F4E9D0', '#D8D3C5', '#E8C87A', '#F0A8A0', '#E4D6E0',
  '#BFD8CF', '#D9B95C', '#C9A87A', '#D9A8A0', '#7FA39A', '#9FB0C4',
  '#B4674F', '#D96A4A', '#4E79A8', '#4E7A50', '#7A5A8E', '#D4AF37',
  '#D9527E', '#26272D', '#3A3E46', '#5C2320', '#1E3A4C',
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
  const ok = INKS.filter((i) => contrast(i, paper) >= 4.5);
  const pool = ok.length > 0 ? ok : [INKS[0]];
  return pool[Math.floor(rnd() * pool.length)];
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
  const lean = rnd() < 0.22 ? (rnd() - 0.5) * 20 : 0;
  const cut = (x: number, y: number): [number, number] => {
    if (rnd() < 0.32) {
      const k = 0.25 + rnd() * 0.28;
      x += (50 - x) * k;
      y += (50 - y) * k;
    }
    return [+x.toFixed(1), +y.toFixed(1)];
  };
  const pts: ReadonlyArray<readonly [number, number]> = [
    cut(j(-2, 8), j(-2, 9)),
    [j(30, 14) + lean, j(-3, 8)],
    [j(50, 16) + lean, j(-2, 7)],
    [j(70, 14) + lean, j(-3, 8)],
    cut(j(102, 8), j(-2, 9)),
    [j(103, 6), j(35, 16)],
    [j(103, 6), j(65, 16)],
    cut(j(102, 8), j(102, 9)),
    [j(70, 14) - lean, j(103, 8)],
    [j(50, 16) - lean, j(102, 7)],
    [j(30, 14) - lean, j(103, 8)],
    cut(j(-2, 8), j(102, 9)),
    [j(-3, 6), j(65, 16)],
    [j(-3, 6), j(35, 16)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(',')})`;
}

export function makeScrap(index: number): Scrap {
  const rnd = mulberry32(index * 2654435761 + 7);
  const paper = PALETTE[Math.floor(rnd() * PALETTE.length)];
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

  return {
    cls: cls.join(' '),
    style: {
      '--paper': paper,
      '--ink': ink,
      '--clip': polygon(rnd),
      '--rot': `${((rnd() - 0.5) * 10).toFixed(2)}deg`,
      '--ff': font,
      '--fs': `${(0.95 + rnd() * 0.5).toFixed(2)}em`,
      '--ix': `${ix.toFixed(1)}%`,
      '--iy': `${iy.toFixed(1)}%`,
      '--nx': `${((rnd() - 0.5) * 7).toFixed(1)}%`,
      '--ny': `${((rnd() - 0.5) * 7).toFixed(1)}%`,
      '--shc': ink,
      '--chip': chip,
    },
  };
}
