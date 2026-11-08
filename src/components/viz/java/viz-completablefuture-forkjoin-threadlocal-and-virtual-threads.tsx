/**
 * completablefuture-forkjoin-threadlocal-and-virtual-threads — 2 visuals.
 * 1. CompletableFuture async chain (animated).
 * 2. ForkJoin work-stealing (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: CompletableFuture async chain (animated) ---------------- */

const CF_STEPS: VizStep[] = [
  { id: 'a', description: 'supplyAsync starts the async computation.', state: { stage: 'supplyAsync' } },
  { id: 'b', description: 'thenApply maps the result when ready.', state: { stage: 'thenApply' } },
  { id: 'c', description: 'thenCombine merges two independent futures.', state: { stage: 'thenCombine' } },
];

function renderCf(step: VizStep | undefined) {
  const s = step?.state as { stage?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="CompletableFuture async chain">
      <JBox x={40} y={20} w={440} h={44} title="CompletableFuture: compose async stages without blocking" />
      <JBox x={40} y={80} w={440} title={s.stage} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Terminate pipelines with exceptionally / handle; never ignore a failed future.'}</JNote>
    </svg>
  );
}

function CompletableFutureChain() {
  return <VizPlayer steps={CF_STEPS} render={renderCf} autoPlay={false} />;
}

/* ---------------- Visual 2: ForkJoin work-stealing (animated) ---------------- */

const FJ_STEPS: VizStep[] = [
  { id: 'a', description: 'Each worker has its own deque of forked subtasks.', state: { steal: false } },
  { id: 'b', description: 'Idle worker steals the oldest task from another worker’s deque.', state: { steal: true } },
];

function renderFj(step: VizStep | undefined) {
  const s = step?.state as { steal?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="ForkJoin work stealing">
      <JBox x={40} y={20} w={440} h={44} title="Work-stealing: idle workers take from busy deques" />
      <JBox x={40} y={80} w={440} title={s.steal ? 'stealing a subtask' : 'own deque, no steal needed'} rows={[]} tone="good" />
      <JNote x={40} y={155}>{'Stealing the oldest task keeps steals few and load balanced.'}</JNote>
    </svg>
  );
}

function WorkStealing() {
  return <VizPlayer steps={FJ_STEPS} render={renderFj} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'CompletableFuture async chain',
    caption: 'thenApply / thenCompose / thenCombine compose async stages.',
    notice: 'Terminate with exceptionally / handle — never ignore failures.',
    component: CompletableFutureChain,
  },
  {
    title: 'ForkJoin work-stealing',
    caption: 'Idle workers steal the oldest task from busy deques.',
    notice: 'Used by parallel streams; common pool shared with ForkJoinPool.commonPool().',
    component: WorkStealing,
  },
];
