import { useEffect, useMemo, useState } from 'react';
import { PACKS, type LangId } from './languages';
import { timeToWords } from './logic/time';
import { makeScrap } from './scrap';

const LANG_KEY = 'reloj-lang';

function useMinuteTick() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let handle: number;
    const tick = () => {
      const d = new Date();
      const delay = 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()) + 50;
      handle = window.setTimeout(() => {
        setNow(new Date());
        tick();
      }, delay);
    };
    tick();
    return () => window.clearTimeout(handle);
  }, []);
  return now;
}

export function App() {
  const [lang, setLang] = useState<LangId>(() => (localStorage.getItem(LANG_KEY) as LangId) in PACKS ? (localStorage.getItem(LANG_KEY) as LangId) : 'es');
  const now = useMinuteTick();
  const pack = PACKS[lang];

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const { cells, phrase } = useMemo(() => {
    const { keys, phrase } = timeToWords(now, pack);
    const lit = new Set<string>();
    for (const key of keys) {
      const [r, c, len, dir] = pack.placements[key];
      for (let i = 0; i < len; i++) lit.add(dir === 'v' ? `${r + i},${c}` : `${r},${c + i}`);
    }
    return { cells: lit, phrase };
  }, [now, pack]);

  const scraps = useMemo(() => [...pack.grid.join('')].map((ch, i) => makeScrap(i, ch)), [pack]);

  return (
    <main className="stage">
      <div className="controls">
        <div className="seg" role="group" aria-label="Language">
          {(Object.keys(PACKS) as LangId[]).map((id) => (
            <button key={id} type="button" aria-pressed={lang === id} className={lang === id ? 'on' : ''} onClick={() => setLang(id)}>
              {id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="sr" role="timer" aria-live="polite">
        {phrase}
      </p>

      <div className="clock" aria-hidden="true">
        {pack.grid.flatMap((row, r) =>
          [...row].map((letter, c) => {
            const i = r * row.length + c;
            const scrap = scraps[i];
            const cellCls = `${cells.has(`${r},${c}`) ? 'cell lit' : 'cell'}${scrap.tape ? ' tape' : ''}`;
            return (
              <span
                key={`${r}-${c}`}
                className={cellCls}
                style={{ '--d': `${(r + c) * 26}ms`, ...scrap.style } as React.CSSProperties}
              >
                <span className={scrap.cls ? `scrap ${scrap.cls}` : 'scrap'}>{scrap.lower ? letter.toLowerCase() : letter}</span>
              </span>
            );
          }),
        )}
      </div>

      <p className="sig">colmeeee</p>
    </main>
  );
}
