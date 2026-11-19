import type { LanguagePack, Placement } from './types';

const grid = [
  'ESONLASUNA·',
  'DOSTRESSEIS',
  'CUATROCINCO',
  'SIETEOCHOEN',
  'NUEVEMEDIA·',
  'DIEZONCE···',
  'DOCE·MENOS·',
  'PUNTOCUARTO',
  'VEINTICINCO',
  '··VEINTEY··',
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
  CINCO: [2, 6, 5],
  SIETE: [3, 0, 5],
  OCHO: [3, 5, 4],
  EN: [3, 9, 2],
  NUEVE: [4, 0, 5],
  MEDIA: [4, 5, 5],
  DIEZ: [5, 0, 4],
  ONCE: [5, 4, 4],
  DOCE: [6, 0, 4],
  MENOS: [6, 5, 5],
  PUNTO: [7, 0, 5],
  CUARTO: [7, 5, 6],
  VEINTICINCO: [8, 0, 11],
  VEINTE: [9, 2, 6],
  Y: [9, 8, 1],
} as const satisfies Record<string, Placement>;

const HOURS = ['UNA', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ', 'ONCE', 'DOCE'];
const MINUTES: Record<number, string> = { 5: 'CINCO', 10: 'DIEZ', 15: 'CUARTO', 20: 'VEINTE', 25: 'VEINTICINCO', 30: 'MEDIA' };

const toWords = (hour: number, m: number) => {
  const article = hour === 1 ? ['ES', 'LA'] : ['SON', 'LAS'];
  const h = [HOURS[hour - 1]];
  if (m === 0) return { keys: [...article, ...h, 'EN', 'PUNTO'], phrase: [...article, ...h, 'EN', 'PUNTO'].join(' ') };
  if (m <= 30) {
    const keys = [...article, ...h, 'Y', MINUTES[m]];
    return { keys, phrase: keys.join(' ') };
  }
  const keys = [...article, ...h, 'MENOS', MINUTES[60 - m]];
  return { keys, phrase: keys.join(' ') };
};

export const es: LanguagePack = { id: 'es', label: 'Español', locale: 'es-ES', grid, placements, toWords };
