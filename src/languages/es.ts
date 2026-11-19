import type { LanguagePack, Placement } from './types';

const grid = [
  'ESONLASUNAQ',
  'DOSTRESSEIS',
  'CUATROCINCO',
  'SIETEOCHORL',
  'NUEVEONCEZR',
  'DOCEDIEZQZE',
  'YMENOSDIEZN',
  'VEINTEMEDIA',
  'PUNTOCUARTO',
  'VEINTICINCO',
];

const placements = {
  ES: [0, 0, 2],
  SON: [0, 1, 3],
  LAS: [0, 4, 3],
  LA: [0, 4, 2],
  UNA: [0, 7, 3],
  DOS: [1, 0, 3],
  TRES: [1, 3, 4],
  SEIS: [1, 7, 4],
  CUATRO: [2, 0, 6],
  CINCOH: [2, 6, 5],
  SIETE: [3, 0, 5],
  OCHO: [3, 5, 4],
  NUEVE: [4, 0, 5],
  ONCE: [4, 5, 4],
  DOCE: [5, 0, 4],
  DIEZH: [5, 4, 4],
  Y: [6, 0, 1],
  MENOS: [6, 1, 5],
  DIEZ: [6, 6, 4],
  EN: [5, 10, 2, 'v'],
  VEINTE: [7, 0, 6],
  MEDIA: [7, 6, 5],
  PUNTO: [8, 0, 5],
  CUARTO: [8, 5, 6],
  VEINTICINCO: [9, 0, 11],
  CINCO: [9, 6, 5],
} as const satisfies Record<string, Placement>;

const HOURS = ['UNA', 'DOS', 'TRES', 'CUATRO', 'CINCOH', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZH', 'ONCE', 'DOCE'];
const MINUTES: Record<number, string> = { 5: 'CINCO', 10: 'DIEZ', 15: 'CUARTO', 20: 'VEINTE', 25: 'VEINTICINCO', 30: 'MEDIA' };
const SAY: Record<string, string> = { CINCOH: 'CINCO', DIEZH: 'DIEZ' };
const say = (key: string) => SAY[key] ?? key;

const toWords = (hour: number, m: number) => {
  const article = hour === 1 ? ['ES', 'LA'] : ['SON', 'LAS'];
  const h = [HOURS[hour - 1]];
  if (m === 0) {
    const keys = [...article, ...h, 'EN', 'PUNTO'];
    return { keys, phrase: keys.map(say).join(' ') };
  }
  if (m <= 30) {
    const keys = [...article, ...h, 'Y', MINUTES[m]];
    return { keys, phrase: keys.map(say).join(' ') };
  }
  const keys = [...article, ...h, 'MENOS', MINUTES[60 - m]];
  return { keys, phrase: keys.map(say).join(' ') };
};

export const es: LanguagePack = { id: 'es', label: 'Español', locale: 'es-ES', grid, placements, toWords };
