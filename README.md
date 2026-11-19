# Reloj

The time in words — a typographic word clock. EN / ES.

Live: https://colmeeee.github.io/reloj

## What it is

A grid of letters where the current time lights up as a phrase — *SON LAS DOS Y MEDIA*, *IT IS HALF PAST TWO*. The phrase is rounded to the nearest five minutes, the way word clocks speak. A visually-hidden live region reads the exact phrase for screen readers, and a numeric strip shows the precise time.

## Stack

Vite · React 19 · TypeScript (strict) · Inter Variable · CSS-only choreography (`prefers-reduced-motion` respected)

## Languages

Each language is a pack: its own letter grid plus its time grammar (`src/languages`). Adding a language = adding one pack.

## Development

```sh
pnpm install
pnpm test
pnpm dev
```

The time logic is pure and covered by 1440-minute snapshots per language.

## License

Apache-2.0 · [colmeeee](https://github.com/colmeeee)
