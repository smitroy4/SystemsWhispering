/**
 * string-methods-and-builders — 2 visuals.
 * 1. String vs StringBuilder vs StringBuffer comparison (static).
 * 2. Internal buffer growth animation (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: comparison chart ---------------- */

function Comparison() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 260" role="img" aria-label="String StringBuilder StringBuffer comparison">
      <JBox x={40} y={20} w={520} h={44} title="String vs StringBuilder vs StringBuffer" />
      <JBox x={40} y={80} w={160} title="String" rows={['immutable', 'thread-safe', 'slow in loops']} tone="good" />
      <JBox x={220} y={80} w={160} title="StringBuilder" rows={['mutable', 'not thread-safe', 'fastest']} tone="good" />
      <JBox x={400} y={80} w={160} title="StringBuffer" rows={['mutable', 'thread-safe', 'synchronized']} />
      <JArrow x1={200} y1={120} x2={220} y2={120} />
      <JArrow x1={380} y1={120} x2={400} y2={120} />
      <JNote x={40} y={180}>{'Use StringBuilder for single-threaded loops; StringBuffer only when sharing across threads.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: buffer growth (animated) ---------------- */

const GROWTH_STEPS: VizStep[] = [
  { id: 'a', description: 'StringBuilder grows its internal char array as you append.', state: { cap: 16 } },
  { id: 'b', description: 'Append past capacity → new array ~2x size, copy old contents.', state: { cap: 34 } },
];

function renderGrowth(step: VizStep | undefined) {
  const s = step?.state as { cap?: number } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="StringBuilder buffer growth">
      <JBox x={40} y={20} w={440} h={44} title="Internal buffer grows as you append (amortized O(1))" />
      <JBox x={40} y={80} w={440} title={'capacity = ' + s.cap} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'StringBuilder(String) starts at length+16; grows by ~2x when full.'}</JNote>
    </svg>
  );
}

function Growth() {
  return <VizPlayer steps={GROWTH_STEPS} render={renderGrowth} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'String vs StringBuilder vs StringBuffer',
    caption: 'Mutability, thread safety, and speed compared.',
    notice: 'StringBuilder is the default for building strings in loops.',
    component: Comparison,
  },
  {
    title: 'Internal buffer growth',
    caption: 'StringBuilder doubles its backing array when it runs out of room.',
    notice: 'Pre-size with new StringBuilder(capacity) to avoid resizes.',
    component: Growth,
  },
];
