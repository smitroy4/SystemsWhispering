/**
 * atomics-and-cas — 2 visuals.
 * 1. CAS compare-and-swap step animation (animated).
 * 2. Atomic vs synchronized timeline (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: CAS compare-and-swap (animated) ---------------- */

const CAS_STEPS: VizStep[] = [
  { id: 'a', description: 'Read value = 5 as expectation.', state: { expect: 5, current: 5 } },
  { id: 'b', description: 'CAS(5, 6): value still 5 → swap to 6, success.', state: { expect: 5, current: 6 } },
  { id: 'c', description: 'CAS(5, 6): value changed to 7 → fail, retry.', state: { expect: 5, current: 7 } },
];

function renderCas(step: VizStep | undefined) {
  const s = step?.state as { expect?: number; current?: number } ?? {};
  const ok = s.expect === s.current;
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="CAS compare and swap step">
      <JBox x={40} y={20} w={440} h={44} title="CAS: if value == expectation, swap; else fail and retry" />
      <JBox x={40} y={80} w={440} title={'value = ' + (s.current ?? 0) + ', expect = ' + s.expect} rows={[ok ? 'swap succeeded' : 'swap failed, retry']} tone={ok ? 'good' : 'bad'} />
      <JNote x={40} y={160}>{'CAS is a hardware atomic read-modify-write — the basis of lock-free programming.'}</JNote>
    </svg>
  );
}

function CasStep() {
  return <VizPlayer steps={CAS_STEPS} render={renderCas} autoPlay={false} />;
}

/* ---------------- Visual 2: atomic vs synchronized timeline ---------------- */

function AtomicVsSync() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Atomic vs synchronized timeline">
      <JBox x={40} y={20} w={480} h={44} title="Atomic variables vs synchronized: lock-free vs lock-based" />
      <JBox x={40} y={80} w={240} title="AtomicInteger" rows={['lock-free CAS', 'one variable', 'no blocking']} tone="good" />
      <JBox x={300} y={80} w={220} title="synchronized" rows={['monitor lock', 'any number of vars', 'blocks threads']} />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Use atomics for a single hot counter; synchronized for multi-field invariants.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'CAS compare-and-swap step',
    caption: 'Compare-and-swap: if value equals expectation, swap and succeed.',
    notice: 'Lock-free; under contention threads retry — cache-line ping-pong.',
    component: CasStep,
  },
  {
    title: 'Atomic vs synchronized timeline',
    caption: 'CAS is lock-free for one variable; synchronized guards multi-field invariants.',
    notice: 'Two atomics do not make a multi-field invariant atomic.',
    component: AtomicVsSync,
  },
];
