import { describe, expect, it } from 'vitest';
import { PACKS, placementStart, realWord } from '../languages';
import { hour12, nextHour, roundMinute, timeToWords } from './time';

const at = (h: number, m: number) => new Date(2026, 10, 19, h, m, 0, 0);

describe('rounding', () => {
  it('rounds to the nearest 5 and wraps at 60', () => {
    expect(roundMinute(2)).toBe(0);
    expect(roundMinute(3)).toBe(5);
    expect(roundMinute(32)).toBe(30);
    expect(roundMinute(33)).toBe(35);
    expect(roundMinute(58)).toBe(0);
  });
  it('wraps the hour at 12', () => {
    expect(hour12(0)).toBe(12);
    expect(hour12(13)).toBe(1);
    expect(nextHour(12)).toBe(1);
  });
});

describe('grid integrity', () => {
  for (const pack of Object.values(PACKS)) {
    it(`${pack.id}: 10 rows of 11 cells`, () => {
      expect(pack.grid).toHaveLength(10);
      for (const row of pack.grid) expect(row).toHaveLength(11);
    });
    it(`${pack.id}: every placement matches the grid (horizontal or vertical)`, () => {
      for (const [key, [r, c, len, dir]] of Object.entries(pack.placements)) {
        const slice =
          dir === 'v'
            ? Array.from({ length: len }, (_, i) => pack.grid[r + i][c]).join('')
            : pack.grid[r].slice(c, c + len);
        expect(slice, `${pack.id} ${key}`).toBe(realWord(key));
      }
    });
  }
});

describe('reading order (the phrase must read top-to-bottom, left-to-right)', () => {
  for (const pack of Object.values(PACKS)) {
    it(`${pack.id}: every minute's words appear in phrase order on the grid`, () => {
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m++) {
          const { keys } = timeToWords(at(h, m), pack);
          const starts = keys.map((k) => placementStart(pack.placements[k]));
          for (let i = 1; i < starts.length; i++) {
            expect(starts[i], `${pack.id} ${h}:${m} → ${keys.join(' ')}`).toBeGreaterThan(starts[i - 1]);
          }
        }
      }
    });
  }
});

describe('full-day coverage', () => {
  for (const pack of Object.values(PACKS)) {
    it(`${pack.id}: all 1440 minutes resolve to placed words`, () => {
      for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m++) {
          const { keys, phrase } = timeToWords(at(h, m), pack);
          for (const key of keys) expect(pack.placements[key], `${h}:${m} → ${key}`).toBeDefined();
          expect(phrase.length).toBeGreaterThan(0);
        }
      }
    });
    it(`${pack.id}: phrase baseline`, () => {
      const phrases = Array.from({ length: 1440 }, (_, i) => timeToWords(at(Math.floor(i / 60), i % 60), pack).phrase);
      expect(phrases).toMatchSnapshot();
    });
  }
});

describe('known cases', () => {
  it('es: 2:59 carries the hour, never two o clock', () => {
    expect(timeToWords(at(2, 58), PACKS.es).phrase).toBe('SON LAS TRES EN PUNTO');
    expect(timeToWords(at(2, 59), PACKS.es).phrase).toBe('SON LAS TRES EN PUNTO');
  });
  it('en: 2:59 carries the hour, never two o clock', () => {
    expect(timeToWords(at(2, 58), PACKS.en).phrase).toBe("IT IS THREE O'CLOCK");
    expect(timeToWords(at(2, 59), PACKS.en).phrase).toBe("IT IS THREE O'CLOCK");
  });
  it('es: midnight-1 rounds to one', () => {
    expect(timeToWords(at(0, 58), PACKS.es).phrase).toBe('ES LA UNA EN PUNTO');
    expect(timeToWords(at(23, 59), PACKS.es).phrase).toBe('SON LAS DOCE EN PUNTO');
  });
  it('es: 2:30 is y media, never menos media', () => {
    expect(timeToWords(at(14, 30), PACKS.es).phrase).toBe('SON LAS DOS Y MEDIA');
    expect(timeToWords(at(2, 30), PACKS.es).phrase).toBe('SON LAS DOS Y MEDIA');
  });
  it('es: 1:45 rounds to the next hour', () => {
    expect(timeToWords(at(13, 45), PACKS.es).phrase).toBe('SON LAS DOS MENOS CUARTO');
  });
  it('es: 1:00 uses singular', () => {
    expect(timeToWords(at(13, 0), PACKS.es).phrase).toBe('ES LA UNA EN PUNTO');
  });
  it('es: no phrase ever says menos media', () => {
    for (let i = 0; i < 1440; i++) {
      expect(timeToWords(at(Math.floor(i / 60), i % 60), PACKS.es).phrase).not.toContain('MENOS MEDIA');
    }
  });
  it('en: half past two', () => {
    expect(timeToWords(at(14, 30), PACKS.en).phrase).toBe("IT IS HALF PAST TWO");
  });
  it('en: quarter to two', () => {
    expect(timeToWords(at(13, 45), PACKS.en).phrase).toBe('IT IS QUARTER TO TWO');
  });
  it('en: speech says oclock, grid stays classic', () => {
    expect(timeToWords(at(22, 0), PACKS.en).phrase).toBe("IT IS TEN O'CLOCK");
    expect(timeToWords(at(22, 0), PACKS.en).keys).toEqual(['IT', 'IS', 'TENH']);
  });
  it('en: no phrase ever says to half', () => {
    for (let i = 0; i < 1440; i++) {
      expect(timeToWords(at(Math.floor(i / 60), i % 60), PACKS.en).phrase).not.toContain('TO HALF');
    }
  });
});
