import type { LanguagePack, Placement } from './types';

const grid = [
  'IT·IS··TEN·',
  'TWENTYFIVE·',
  'QUARTERPAST',
  'ONE··TWELVE',
  'THREE··FOUR',
  'FIVE·SIXTWO',
  'HALF··SEVEN',
  'EIGHT·NINE·',
  'TEN·OCLOCK·',
  'ELEVEN·TO··',
];

const placements = {
  IT: [0, 0, 2],
  IS: [0, 3, 2],
  TEN: [0, 7, 3],
  TWENTY: [1, 0, 6],
  FIVE: [1, 6, 4],
  TWENTYFIVE: [1, 0, 10],
  QUARTER: [2, 0, 7],
  PAST: [2, 7, 4],
  ONE: [3, 0, 3],
  TWELVE: [3, 5, 6],
  THREE: [4, 0, 5],
  FOUR: [4, 7, 4],
  FIVEH: [5, 0, 4],
  SIX: [5, 5, 3],
  TWO: [5, 8, 3],
  HALF: [6, 0, 4],
  SEVEN: [6, 6, 5],
  EIGHT: [7, 0, 5],
  NINE: [7, 6, 4],
  TENH: [8, 0, 3],
  OCLOCK: [8, 4, 6],
  ELEVEN: [9, 0, 6],
  TO: [9, 7, 2],
} as const satisfies Record<string, Placement>;

const HOURS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVEH', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TENH', 'ELEVEN', 'TWELVE'];
const MINUTES: Record<number, string> = { 5: 'FIVE', 10: 'TEN', 15: 'QUARTER', 20: 'TWENTY', 25: 'TWENTYFIVE' };
const SAY: Record<string, string> = { FIVEH: 'FIVE', TENH: 'TEN' };
const say = (key: string) => SAY[key] ?? key;

const toWords = (hour: number, m: number) => {
  const h = HOURS[hour - 1];
  if (m === 0) {
    const keys = ['IT', 'IS', h, 'OCLOCK'];
    return { keys, phrase: keys.map(say).join(' ') };
  }
  if (m === 30) {
    const keys = ['IT', 'IS', 'HALF', 'PAST', h];
    return { keys, phrase: keys.map(say).join(' ') };
  }
  if (m < 30) {
    const keys = ['IT', 'IS', MINUTES[m], 'PAST', h];
    return { keys, phrase: keys.map(say).join(' ') };
  }
  const keys = ['IT', 'IS', MINUTES[60 - m], 'TO', h];
  return { keys, phrase: keys.map(say).join(' ') };
};

export const en: LanguagePack = { id: 'en', label: 'English', locale: 'en-GB', grid, placements, toWords };
