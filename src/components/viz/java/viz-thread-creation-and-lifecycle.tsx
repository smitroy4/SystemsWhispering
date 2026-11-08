/**
 * thread-creation-and-lifecycle — 2 visuals.
 * 1. Thread creation classification Thread vs Runnable vs Callable (static).
 * 2. Six lifecycle states animation (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: thread creation classification ---------------- */

function Creation() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 240" role="img" aria-label="Thread creation classification">
      <JBox x={40} y={20} w={520} h={44} title="Three ways to create a thread: Thread, Runnable, Callable" />
      <JBox x={40} y={80} w={160} title="Thread" rows={['extends Thread', 'override run()']} tone="good" />
      <JBox x={220} y={80} w={160} title="Runnable" rows={['implement Runnable', 'pass to Thread']} />
      <JBox x={400} y={80} w={160} title="Callable" rows={['implements Callable', 'returns a value', 'used with executors']} tone="good" />
      <JArrow x1={200} y1={120} x2={220} y2={120} />
      <JArrow x1={380} y1={120} x2={400} y2={120} />
      <JNote x={40} y={180}>{'Runnable separates the task from the thread; Callable adds a returned result.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: six lifecycle states (animated) ---------------- */

const LIFECYCLE_STEPS: VizStep[] = [
  { id: 'a', description: 'NEW: thread created but not started.', state: { state: 'NEW' } },
  { id: 'b', description: 'RUNNABLE: start() called; eligible to run.', state: { state: 'RUNNABLE' } },
  { id: 'c', description: 'BLOCKED/WAITING/TIMED_WAITING: waiting on lock or sleep.', state: { state: 'WAITING' } },
  { id: 'd', description: 'TERMINATED: run() completed.', state: { state: 'TERMINATED' } },
];

function renderLifecycle(step: VizStep | undefined) {
  const s = step?.state as { state?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Thread lifecycle states">
      <JBox x={40} y={20} w={440} h={44} title="Six thread lifecycle states" />
      <JBox x={40} y={80} w={440} title={s.state ?? 'NEW'} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'start() moves NEW → RUNNABLE; the scheduler picks when it actually runs.'}</JNote>
    </svg>
  );
}

function LifecycleStates() {
  return <VizPlayer steps={LIFECYCLE_STEPS} render={renderLifecycle} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Thread creation classification',
    caption: 'Thread vs Runnable vs Callable.',
    notice: 'Prefer Runnable/Callable over extending Thread.',
    component: Creation,
  },
  {
    title: 'Six lifecycle states',
    caption: 'NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED.',
    notice: 'start() makes a thread eligible; the scheduler decides when it runs.',
    component: LifecycleStates,
  },
];
