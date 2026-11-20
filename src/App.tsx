import { useEffect, useMemo, useState } from 'react';
import { PACKS, type LangId } from './languages';
import { timeToWords } from './logic/time';
import { makeScrap } from './scrap';

const LANG_KEY = 'reloj-lang';
const MODE_KEY = 'reloj-mode';
type Mode = 'zen' | 'info';

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
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem(MODE_KEY) === 'zen' ? 'zen' : 'info'));
  const now = useMinuteTick();
  const pack = PACKS[lang];

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    localStorage.setItem(MODE_KEY, mode);
    document.documentElement.lang = lang;
  }, [lang, mode]);

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

  const timeText = new Intl.DateTimeFormat(pack.locale, { hour: '2-digit', minute: '2-digit' }).format(now);
  const dateText = new Intl.DateTimeFormat(pack.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const hourValue = String(now.getHours()).padStart(2, '0');
  const minuteValue = String(now.getMinutes()).padStart(2, '0');

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
        <div className="seg" role="group" aria-label="Mode">
          <button type="button" aria-pressed={mode === 'zen'} className={mode === 'zen' ? 'on' : ''} onClick={() => setMode('zen')}>
            zen
          </button>
          <button type="button" aria-pressed={mode === 'info'} className={mode === 'info' ? 'on' : ''} onClick={() => setMode('info')}>
            info
          </button>
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

      <div className={mode === 'info' ? 'strip' : 'strip hidden'}>
        <time dateTime={`${hourValue}:${minuteValue}`}>{timeText}</time>
        <span className="date">{dateText}</span>
      </div>

      <p className="sig">colmeeee</p>
    </main>
  );
}
