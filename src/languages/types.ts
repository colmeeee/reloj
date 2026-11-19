export type Placement = readonly [row: number, col: number, len: number, dir?: 'h' | 'v'];

export type TimeInWords = { keys: string[]; phrase: string };

export type LanguagePack = {
  id: string;
  label: string;
  locale: string;
  grid: string[];
  placements: Record<string, Placement>;
  toWords: (hour12: number, minuteRounded: number) => TimeInWords;
};
