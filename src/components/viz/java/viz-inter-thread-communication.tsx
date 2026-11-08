/**
 * inter-thread-communication — 2 visuals.
 * 1. Wait set / notify animation (animated).
 * 2. Producer-consumer bounded buffer (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: wait set / notify (animated) ---------------- */

const WAIT_STEPS: VizStep[] = [
  { id: 'a', description: 'Consumer calls wait(); joins the wait set and releases the lock.', state: { state: 'waiting' } },
  { id: 'b', description: 'Producer calls notifyAll(); wait set is notified.', state: { state: 'notified' } },
];

function renderWait(step: VizStep | undefined) {
  const s = step?.state as { state?: string } ?? {};
  const label = s.state === 'waiting' ? 'consumer waiting in wait set' : 'producer notifies wait set';
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="Wait set notify animation">
      <JBox x={40} y={20} w={440} h={44} title="wait() joins the wait set; notify()/notifyAll() wakes threads" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={155}>{'Always wait in a while loop checking the predicate — guards against spurious wakeups.'}</JNote>
    </svg>
  );
}

function WaitNotify() {
  return <VizPlayer steps={WAIT_STEPS} render={renderWait} autoPlay={false} />;
}

/* ---------------- Visual 2: producer-consumer bounded buffer (animated) ---------------- */

const PC_STEPS: VizStep[] = [
  { id: 'a', description: 'Producer adds an item; buffer fill level rises.', state: { level: 3 } },
  { id: 'b', description: 'Consumer removes an item; buffer fill level falls.', state: { level: 2 } },
];

function renderPc(step: VizStep | undefined) {
  const s = step?.state as { level?: number } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="Producer consumer bounded buffer">
      <JBox x={40} y={20} w={440} h={44} title="Bounded buffer: producers fill, consumers drain; wait/notify coordinates them" />
      <JBox x={40} y={80} w={440} title={'fill level ' + (s.level ?? 0) + ' / 5'} rows={[]} tone="good" />
      <JNote x={40} y={155}>{'Producers wait when full; consumers wait when empty; notifyAll wakes the right side.'}</JNote>
    </svg>
  );
}

function ProducerConsumer() {
  return <VizPlayer steps={PC_STEPS} render={renderPc} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Wait set / notify animation',
    caption: 'wait() joins the wait set; notify() wakes one, notifyAll() wakes all.',
    notice: 'Always wait in a while loop on the predicate.',
    component: WaitNotify,
  },
  {
    title: 'Producer-consumer bounded buffer',
    caption: 'Live fill level; producers wait when full, consumers wait when empty.',
    notice: 'Use notifyAll to avoid lost wakeups.',
    component: ProducerConsumer,
  },
];
