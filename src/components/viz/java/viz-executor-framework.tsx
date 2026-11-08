/**
 * executor-framework — 2 visuals.
 * 1. Thread-pool task submission (animated).
 * 2. Future lifecycle (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: thread-pool task submission (animated) ---------------- */

const POOL_STEPS: VizStep[] = [
  { id: 'a', description: 'Task submitted → enqueued in the task queue.', state: { stage: 'queued' } },
  { id: 'b', description: 'A worker thread takes the task from the queue and runs it.', state: { stage: 'running' } },
  { id: 'c', description: 'Task completes; result stored in the Future.', state: { stage: 'done' } },
];

function renderPool(step: VizStep | undefined) {
  const s = step?.state as { stage?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Thread pool task submission">
      <JBox x={40} y={20} w={440} h={44} title="Task queue → worker threads: submit, run, complete" />
      <JBox x={40} y={80} w={440} title={s.stage} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'A bounded queue plus a rejection policy protects against overload.'}</JNote>
    </svg>
  );
}

function ThreadPool() {
  return <VizPlayer steps={POOL_STEPS} render={renderPool} autoPlay={false} />;
}

/* ---------------- Visual 2: Future lifecycle (static) ---------------- */

function FutureLifecycle() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Future lifecycle">
      <JBox x={40} y={20} w={480} h={44} title="Future lifecycle: pending → completed / cancelled / failed" />
      <JBox x={40} y={80} w={240} title="Pending" rows={['task submitted', 'not yet done']} tone="good" />
      <JBox x={300} y={80} w={220} title="Terminal" rows={['completed', 'cancelled', 'failed (ExecutionException)']} />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'get() blocks until the result is ready; exceptions surface via ExecutionException.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Thread-pool task submission',
    caption: 'Task queue → worker threads; submit, run, complete.',
    notice: 'Use bounded queues so overload rejects instead of OOM.',
    component: ThreadPool,
  },
  {
    title: 'Future lifecycle',
    caption: 'Pending → completed / cancelled / failed.',
    notice: 'Always check the result or handle exceptions from get().',
    component: FutureLifecycle,
  },
];
