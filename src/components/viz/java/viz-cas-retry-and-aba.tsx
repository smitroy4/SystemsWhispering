/**
 * cas-retry-and-aba — 2 visuals.
 * 1. CAS retry loop under contention (animated).
 * 2. ABA problem timeline (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: CAS retry loop (animated) ---------------- */

const RETRY_STEPS: VizStep[] = [
  { id: 'a', description: 'Thread reads head = A, builds new node → A.', state: { attempt: 1, ok: false } },
  { id: 'b', description: 'CAS head A → newNode succeeds.', state: { attempt: 2, ok: true } },
  { id: 'c', description: 'Contention: another thread changed head; CAS fails and retries.', state: { attempt: 3, ok: false } },
];

function renderRetry(step: VizStep | undefined) {
  const s = step?.state as { attempt?: number; ok?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="CAS retry loop under contention">
      <JBox x={40} y={20} w={440} h={44} title="CAS retry loop: read, compute, attempt, retry on failure" />
      <JBox x={40} y={80} w={440} title={'attempt ' + (s.attempt ?? 1)} rows={[s.ok ? 'CAS succeeded' : 'CAS failed, retry']} tone={s.ok ? 'good' : 'bad'} />
      <JNote x={40} y={155}>{'Optimistic: no lock; spin until CAS succeeds.'}</JNote>
    </svg>
  );
}

function CasRetry() {
  return <VizPlayer steps={RETRY_STEPS} render={renderRetry} autoPlay={false} />;
}

/* ---------------- Visual 2: ABA problem timeline (animated) ---------------- */

const ABA_STEPS: VizStep[] = [
  { id: 'a', description: 'Thread 1 reads head = A and is preempted.', state: { step: 'read A' } },
  { id: 'b', description: 'Thread 2 pops A, pops B, pushes A back — head is A again.', state: { step: 'A → B → A' } },
  { id: 'c', description: 'Thread 1 CAS A → C succeeds but the list changed — ABA!', state: { step: 'ABA!' } },
];

function renderAba(step: VizStep | undefined) {
  const s = step?.state as { step?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="ABA problem timeline">
      <JBox x={40} y={20} w={440} h={44} title="ABA: value returns to A but the structure changed" />
      <JBox x={40} y={80} w={440} title={s.step} rows={[]} tone="bad" />
      <JNote x={40} y={155}>{'Fix: AtomicStampedReference pairs a version stamp with the reference.'}</JNote>
    </svg>
  );
}

function AbaProblem() {
  return <VizPlayer steps={ABA_STEPS} render={renderAba} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'CAS retry loop under contention',
    caption: 'Spin until CAS succeeds; failed attempts retry.',
    notice: 'Lock-free but can starve under heavy contention.',
    component: CasRetry,
  },
  {
    title: 'ABA problem timeline',
    caption: 'Value returns to A (A → B → A) and fools a plain CAS.',
    notice: 'AtomicStampedReference adds a version stamp to defeat ABA.',
    component: AbaProblem,
  },
];
