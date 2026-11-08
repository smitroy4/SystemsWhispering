/**
 * explicit-locks — 2 visuals.
 * 1. ReentrantLock vs synchronized feature chart (static).
 * 2. ReadWriteLock many readers / one writer (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: ReentrantLock vs synchronized ---------------- */

function FeatureChart() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="ReentrantLock vs synchronized feature chart">
      <JBox x={40} y={20} w={480} h={44} title="ReentrantLock vs synchronized: explicit lock gives more control" />
      <JBox x={40} y={80} w={240} title="synchronized" rows={['implicit lock', 'block-scoped', 'no interruptible lock']} tone="good" />
      <JBox x={300} y={80} w={220} title="ReentrantLock" rows={['tryLock', 'lockInterruptibly', 'fairness option']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'ReentrantLock needs disciplined unlock() in finally; synchronized auto-releases.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: ReadWriteLock many readers / one writer (animated) ---------------- */

const RW_STEPS: VizStep[] = [
  { id: 'a', description: 'Multiple readers hold the read lock simultaneously.', state: { readers: 3, writer: false } },
  { id: 'b', description: 'Writer waits until all readers release, then writes exclusively.', state: { readers: 0, writer: true } },
];

function renderRW(step: VizStep | undefined) {
  const s = step?.state as { readers?: number; writer?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="ReadWriteLock many readers one writer">
      <JBox x={40} y={20} w={440} h={44} title="ReadWriteLock: many readers, or one exclusive writer" />
      <JBox x={40} y={80} w={440} title={'readers: ' + (s.readers ?? 0) + ', writer: ' + (s.writer ? 'yes' : 'no')} rows={[]} tone="good" />
      <JNote x={40} y={155}>{'Read lock is shared; write lock is exclusive. Readers do not block readers.'}</JNote>
    </svg>
  );
}

function ReadWriteLock() {
  return <VizPlayer steps={RW_STEPS} render={renderRW} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'ReentrantLock vs synchronized',
    caption: 'Feature chart: interruptible lock, timed lock, fairness.',
    notice: 'ReentrantLock requires unlock() in finally; synchronized is automatic.',
    component: FeatureChart,
  },
  {
    title: 'ReadWriteLock many readers / one writer',
    caption: 'Read lock shared; write lock exclusive.',
    notice: 'Great for read-mostly workloads; writers can starve under heavy reads.',
    component: ReadWriteLock,
  },
];
