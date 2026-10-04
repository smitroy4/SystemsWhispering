# Systems Whispering

**Learn the craft. Whisper to systems.**

A one-stop learning platform for Java developers: DSA + Low-Level Design (now) + AI (later). Static React site with typed content, Java code, and step-driven SVG animations.

## Stack

- Vite + React 18 + TypeScript, React Router
- Plain CSS (CSS variables, no Tailwind, no UI libraries)
- Self-hosted fonts via `@fontsource` (no Google Fonts links)
- No backend, no external animation libraries

## Develop

```sh
npm install
npm run dev
```

`npm run build` runs content validation first (`scripts/validate-content.ts`), then `tsc` and the Vite build.

## Rules

See `AGENTS.md` — it holds the permanent project rules every task must follow.
