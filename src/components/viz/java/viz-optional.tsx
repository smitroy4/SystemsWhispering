/**
 * optional — 2 visuals.
 * 1. Optional box present/empty flow for map/flatMap/orElse (animated).
 * 2. Anti-pattern vs good pattern (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: Optional box present/empty (animated) ---------------- */

const OPT_STEPS: VizStep[] = [
  { id: 'a', description: 'Optional.of(value) → present box.', state: { state: 'present' } },
  { id: 'b', description: 'map(transform) → applies function if present.', state: { state: 'map' } },
  { id: 'c', description: 'orElse(default) → returns value or default if empty.', state: { state: 'orElse' } },
];

function renderOpt(step: VizStep | undefined) {
  const s = step?.state as { state?: string } ?? {};
  const label = s.state === 'present' ? 'Optional.of(v) [present]' : s.state === 'map' ? 'map(f) → [transformed]' : 'orElse(default) → value';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Optional box present empty">
      <JBox x={40} y={20} w={440} h={44} title="Optional wraps a value that may be absent" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Prefer orElse/get over null checks; never store null inside an Optional.'}</JNote>
    </svg>
  );
}

function OptionalBox() {
  return <VizPlayer steps={OPT_STEPS} render={renderOpt} autoPlay={false} />;
}

/* ---------------- Visual 2: anti-pattern vs good pattern ---------------- */

function Patterns() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Optional anti-pattern vs good pattern">
      <JBox x={40} y={20} w={480} h={44} title="Anti-pattern vs idiomatic Optional usage" />
      <JBox x={40} y={80} w={240} title="Anti-pattern" rows={['if (opt != null)', '  opt.get()', 'defeats the purpose']} tone="bad" />
      <JBox x={300} y={80} w={240} title="Good pattern" rows={['opt.orElse(default)', 'opt.ifPresent(...)', 'opt.map(...).orElse(...)']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Avoid Optional.get() without checking isPresent; use orElse/orElseGet.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Optional box: present / empty',
    caption: 'map / flatMap / orElse flow over a present or empty box.',
    notice: 'Optional is a return type, not a field type — avoid Optional fields.',
    component: OptionalBox,
  },
  {
    title: 'Anti-pattern vs good pattern',
    caption: 'Avoid .get() without isPresent; use orElse / ifPresent / map.',
    notice: 'Optional models absence explicitly instead of null.',
    component: Patterns,
  },
];
