import type { LanguagePack } from '../languages';

export const roundMinute = (m: number) => (Math.round(m / 5) * 5) % 60;

export const hour12 = (h: number) => (h % 12) || 12;

export const nextHour = (h: number) => (h % 12) + 1;

export function timeToWords(date: Date, pack: LanguagePack) {
  const h = hour12(date.getHours());
  const raw = Math.round(date.getMinutes() / 5) * 5;
  const m = raw % 60;
  const hour = raw > 30 ? nextHour(h) : h;
  return pack.toWords(hour, m);
}
