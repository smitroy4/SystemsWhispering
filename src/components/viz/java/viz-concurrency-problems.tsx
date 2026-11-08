/**
 * concurrency-problems — 2 visuals.
 * 1. Lost-update race on a shared counter, interleaving step-through (animated).
 * 2. Visibility: CPU cache vs main memory (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: lost-update race (animated) ---------------- */

const RACE_STEPS: VizStep[] = [
  { id: 'a', description: 'Thread A reads counter = 0.', state: { step: 'A read 0' } },
  { id: 'b', description: 'Thread B reads counter = 0.', state: { step: 'B read 0' } },
  { id: 'c', description: 'A writes 1; B writes 1 — lost update, result 1 not 2.', state: { step: 'lost update' } },
];

function renderRace(step: VizStep | undefined) {
  const s = step?.state as { step?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Lost update race condition">
      <JBox x={40} y={20} w={440} h={44} title="Lost update: counter++ is read-modify-write, not atomic" />
      <JBox x={40} y={80} w={440} title={s.step} rows={[]} tone="bad" />
      <JNote x={40} y={160}>{'Make the increment atomic (synchronized / AtomicInteger) to prevent lost updates.'}</JNote>
    </svg>
  );
}

function Race() {
  return <VizPlayer steps={RACE_STEPS} render={renderRace} autoPlay={false} />;
}

/* ---------------- Visual 2: visibility CPU cache vs main memory ---------------- */

function VisibilityProb() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Visibility CPU cache vs main memory">
      <JBox x={40} y={20} w={480} h={44} title="Visibility: a thread may never see another thread's write" />
      <JBox x={40} y={80} w={240} title="Thread A" rows={['writes flag = true', 'to its CPU cache']} tone="good" />
      <JBox x={300} y={80} w={220} title="Thread B" rows={['reads flag', 'sees stale cache']} tone="bad" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'volatile or synchronized establishes happens-before so writes become visible.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Lost-update race step-through',
    caption: 'Interleaved read-modify-write on a shared counter loses an update.',
    notice: 'counter++ is three operations: read, modify, write — not atomic.',
    component: Race,
  },
  {
    title: 'Visibility: CPU cache vs main memory',
    caption: 'One thread’s write can sit in its cache, invisible to another.',
    notice: 'volatile or synchronized creates a happens-before edge.',
    component: VisibilityProb,
  },
];
