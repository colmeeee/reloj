# Reloj

The time in words — a typographic word clock. EN / ES.

Live: https://colmeio.github.io/reloj

## What it is

A grid of ransom-note scraps — every letter cut from a different "magazine": its own typeface, paper color, scissor-cut polygon, and print treatment (outline, offset shadow, color chip, halftone). The current time lights up as a phrase — *Son las dos y media*, *It is half past two* — rounded to the nearest five minutes, the way word clocks speak. A serif-italic caption under the grid reads the phrase aloud to screen readers (`aria-live`).

## Stack

Vite · React 19 · TypeScript (strict) · CSS-only choreography (`prefers-reduced-motion` respected) · 18 Google display fonts, glyph-subsetted · seeded deterministic randomness (mulberry32) · WCAG-tiered ink picker

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

Apache-2.0 · [colmeio](https://github.com/colmeio)
