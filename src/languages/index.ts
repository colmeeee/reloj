import type { LanguagePack } from './types';
export type { LanguagePack, Placement, TimeInWords } from './types';
import { es } from './es';
import { en } from './en';

export type LangId = 'es' | 'en';

export const PACKS: Record<LangId, LanguagePack> = { es, en };

export const realWord = (key: string) => (key === 'FIVEH' || key === 'TENH' ? key.slice(0, -1) : key);
