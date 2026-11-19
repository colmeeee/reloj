import type { LanguagePack, Placement } from './types';

const grid = [
  'ITLISASAMTI',
  'ACQUARTERDC',
  'TWENTYFIVEX',
  'HALFSTENFTO',
  'PASTERONINE',
  'ONESIXTHREE',
  'SEVENFIVEIO',
  'TWELVEIGHTT',
  'FOURELEVENE',
  'TWORHYTMENN',
];

const placements = {
  IT: [0, 0, 2],
  IS: [0, 3, 2],
  QUARTER: [1, 2, 7],
  TWENTY: [2, 0, 6],
  FIVE: [2, 6, 4],
  TWENTYFIVE: [2, 0, 10],
  HALF: [3, 0, 4],
  TEN: [3, 5, 3],
  TO: [3, 9, 2],
  PAST: [4, 0, 4],
  NINE: [4, 7, 4],
  ONE: [5, 0, 3],
  SIX: [5, 3, 3],
  THREE: [5, 6, 5],
  SEVEN: [6, 0, 5],
  FIVEH: [6, 5, 4],
  TWELVE: [7, 0, 6],
  EIGHT: [7, 5, 5],
  FOUR: [8, 0, 4],
  ELEVEN: [8, 4, 6],
  TWO: [9, 0, 3],
  TENH: [7, 10, 3, 'v'],
} as const satisfies Record<string, Placement>;

const HOURS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVEH', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TENH', 'ELEVEN', 'TWELVE'];
const MINUTES: Record<number, string> = { 5: 'FIVE', 10: 'TEN', 15: 'QUARTER', 20: 'TWENTY', 25: 'TWENTYFIVE' };
const SAY: Record<string, string> = { FIVEH: 'FIVE', TENH: 'TEN' };
const say = (key: string) => SAY[key] ?? key;

const toWords = (hour: number, m: number) => {
  const h = HOURS[hour - 1];
  if (m === 0) {
    const keys = ['IT', 'IS', h];
    return { keys, phrase: `IT IS ${say(h)} O'CLOCK` };
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
