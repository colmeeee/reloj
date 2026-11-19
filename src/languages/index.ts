import type { LanguagePack, Placement } from './types';
import { es } from './es';
import { en } from './en';

export type { LanguagePack, Placement, TimeInWords } from './types';
export type LangId = 'es' | 'en';

export const PACKS: Record<LangId, LanguagePack> = { es, en };

export const realWord = (key: string) =>
  key === 'TENH' || key === 'FIVEH' || key === 'CINCOH' || key === 'DIEZH' ? key.slice(0, -1) : key;

export const placementStart = (p: Placement) => p[0] * 11 + p[1];
