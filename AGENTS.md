# AGENTS.md — Permanent Rules

## PROJECT

"Systems Whispering" – a one-stop learning platform for Java developers: DSA + Low-Level Design (now) + AI (later). Tagline: "Learn the craft. Whisper to systems."

## STACK

- Vite + React 18 + TypeScript
- React Router
- Plain CSS (CSS variables, no Tailwind, no UI libraries)
- No backend
- No external animation libraries

## PERMANENT RULES

Follow these rules in every future task:

1. All content lives in `/src/content` as typed data files (TS/JSON). Pages never hardcode content.
2. All animations are built with SVG + CSS + vanilla JS step engines, wrapped in React components. No canvas, no GSAP/framer.
3. Every animation is driven by a precomputed array of "steps" (frames) so it supports Play, Pause, Next, Prev, Reset, Speed.
4. Every topic page has this order: Intro → Visualization → Java code → Complexity table → Common mistakes → Practice problems.
5. All Java code must be correct, compilable, and use idiomatic Java (generics, Collections where relevant).
6. Never invent LeetCode problems. Use only real problem slugs; URL format `https://leetcode.com/problems/<slug>/`.
7. Folder structure is fixed (see Step 1). Do not rename or restructure without being asked.
8. Work only on the current step. Do not build features from later steps.
9. After each step: run `npm run build` and fix all errors, then summarize what changed.
10. Mobile-first responsive. Dark and light theme via CSS variables.
11. New top-level sections must be isolated modules (own routes, own content folder, own nav entry) so AI can be added later without touching existing code.
12. "Sheets" lives in the sidebar under Practice and in the navbar "Data Structures & Algorithms" menu, with a small link on the home page's problems card.
13. LeetCode problem metadata (title, difficulty) must come from the verified slug whitelist in `scripts/leetcode-slugs.json`, never typed from memory.
14. Every Topic page also has a "Concept Gallery" (conceptual illustrations built with HTML/CSS/SVG/JS) in addition to step animations.
15. Fonts are self-hosted via @fontsource packages. No Google Fonts links.
16. Topic.level allows `'beginner' | 'intermediate' | 'advanced' | 'expert'`.
