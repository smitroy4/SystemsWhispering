/**
 * immutable-classes — 2 visuals.
 * 1. Immutability checklist (static).
 * 2. Mutable-component leak before/after defensive copy (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: immutability checklist ---------------- */

function Checklist() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Immutability checklist">
      <JBox x={40} y={20} w={480} h={44} title="Immutable class recipe: final fields, no setters, defensive copies" />
      <JBox x={40} y={80} w={240} title="Do" rows={['class final', 'fields private final', 'no setters', 'defensive copies']} tone="good" />
      <JBox x={300} y={80} w={240} title="Don't" rows={['expose mutable fields', 'allow reassignment', 'leak internals']} tone="bad" />
      <JArrow x1={280} y1={130} x2={300} y2={130} />
      <JNote x={40} y={200}>{'Records are immutable by default (shallowly) — watch mutable components.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: mutable-component leak before/after ---------------- */

function Leak() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Mutable component leak before and after defensive copy">
      <JBox x={40} y={20} w={480} h={44} title="Defensive copy prevents callers from mutating your internals" />
      <JBox x={40} y={80} w={240} title="Before (leak)" rows={['getDates() returns inner array', 'caller mutates it', 'object corrupted']} tone="bad" />
      <JBox x={300} y={80} w={240} title="After (fixed)" rows={['return dates.clone()', 'caller gets a copy', 'object safe']} tone="good" />
      <JArrow x1={280} y1={130} x2={300} y2={130} />
      <JNote x={40} y={200}>{'Copy on construction and on access — never hand out internal mutable references.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Immutability checklist',
    caption: 'final class, final fields, no setters, defensive copies.',
    notice: 'Records give you most of this automatically (shallow immutability).',
    component: Checklist,
  },
  {
    title: 'Mutable-component leak before/after',
    caption: 'Defensive copy on construction and on access stops internals escaping.',
    notice: 'Always clone mutable arrays/collections returned by getters.',
    component: Leak,
  },
];
