/**
 * enums — 2 visuals.
 * 1. Enum as fixed set of singleton instances (static).
 * 2. EnumMap / EnumSet ordinal layout (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: enum as singletons ---------------- */

function EnumSingletons() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Enum as fixed set of singleton instances">
      <JBox x={40} y={20} w={480} h={44} title="An enum is a fixed set of compile-time singleton instances" />
      <JBox x={40} y={80} w={240} title="enum Day" rows={['MONDAY, TUESDAY, ...', 'private fields + methods', 'compiled to final class']} tone="good" />
      <JBox x={300} y={80} w={240} title="Day.MONDAY" rows={['singleton instance', 'Day.MONDAY == Day.MONDAY']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Enums are type-safe constants — use them instead of int or String constants.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: EnumMap / EnumSet ordinal layout ---------------- */

function EnumMapSet() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="EnumMap EnumSet ordinal layout">
      <JBox x={40} y={20} w={480} h={44} title="EnumMap / EnumSet use ordinal arrays — zero-overhead" />
      <JBox x={40} y={80} w={240} title="EnumMap" rows={['String[] values by ordinal', 'O(1), extremely fast']} tone="good" />
      <JBox x={300} y={80} w={240} title="EnumSet" rows={['bit vector', 'bulk ops are bitwise']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Enum keys map to their ordinal — no hashing, no equals cost.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Enum as singleton instances',
    caption: 'A fixed set of compile-time constants; each constant is a singleton.',
    notice: 'Enums can have fields, methods, and constant-specific bodies.',
    component: EnumSingletons,
  },
  {
    title: 'EnumMap / EnumSet ordinal layout',
    caption: 'Enum-backed array and bit-vector storage keyed by ordinal.',
    notice: 'Prefer EnumMap/EnumSet over HashMap/HashSet for enum keys.',
    component: EnumMapSet,
  },
];
