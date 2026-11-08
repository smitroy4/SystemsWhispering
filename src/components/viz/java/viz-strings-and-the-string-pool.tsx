/**
 * strings-and-the-string-pool — 2 visuals.
 * 1. String pool vs heap, == vs equals (animated).
 * 2. intern() flow (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: string pool vs heap (animated) ---------------- */

const POOL_STEPS: VizStep[] = [
  { id: 'a', description: '"hi" literal goes to the pool; new String("hi") goes to the heap.', state: { mode: 'literal' } },
  { id: 'b', description: '"hi" == "hi" is true (same pooled instance); new String("hi") == "hi" is false.', state: { mode: 'compare' } },
];

function renderPool(step: VizStep | undefined) {
  const s = step?.state as { mode?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="String pool vs heap">
      <JBox x={40} y={20} w={440} h={44} title="String literals live in the pool; new String lives on the heap" />
      <JBox x={40} y={80} w={440} title={s.mode === 'literal' ? 'pooled literals share one instance' : 'new String is a heap object'} rows={[]} tone={s.mode === 'literal' ? 'good' : 'bad'} />
      <JNote x={40} y={160}>{'Use equals() to compare text; use == only for identity (pool membership).'}</JNote>
    </svg>
  );
}

function Pool() {
  return <VizPlayer steps={POOL_STEPS} render={renderPool} autoPlay={false} />;
}

/* ---------------- Visual 2: intern() flow ---------------- */

function Intern() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="intern() flow">
      <JBox x={40} y={20} w={480} h={44} title="intern() moves a heap string into the pool, returning the pooled reference" />
      <JBox x={40} y={80} w={240} title="heap string" rows={['new String("hi")', 'separate object']} tone="bad" />
      <JBox x={300} y={80} w={240} title="after intern()" rows={['pooled, canonical', '== now true']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'intern() canonicalizes a string so identity comparisons work.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'String pool vs heap',
    caption: 'Literals are interned; new String creates heap objects.',
    notice: '"hi" == "hi" is true; new String("hi") == "hi" is false — use equals().',
    component: Pool,
  },
  {
    title: 'intern() flow',
    caption: 'intern() returns the pooled reference for a string, creating it if absent.',
    notice: 'Use intern() when many equal strings should share one instance.',
    component: Intern,
  },
];
