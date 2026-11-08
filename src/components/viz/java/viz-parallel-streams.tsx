/**
 * parallel-streams — 2 visuals.
 * 1. Sequential vs parallel timeline with fork/join (animated).
 * 2. Primitive streams / optionals chart (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: sequential vs parallel timeline (animated) ---------------- */

const PAR_STEPS: VizStep[] = [
  { id: 'a', description: 'Sequential: one thread processes elements one after another.', state: { mode: 'sequential' } },
  { id: 'b', description: 'Parallel: fork/join splits the stream across threads of the common pool.', state: { mode: 'parallel' } },
];

function renderPar(step: VizStep | undefined) {
  const s = step?.state as { mode?: string } ?? {};
  const label = s.mode === 'sequential' ? 'one thread, one element at a time' : 'fork/join across multiple threads';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Sequential vs parallel stream timeline">
      <JBox x={40} y={20} w={440} h={44} title="Parallel streams split work across the common ForkJoinPool" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Parallel helps for large, independent, CPU-bound data; it adds overhead for small streams.'}</JNote>
    </svg>
  );
}

function ParallelTimeline() {
  return <VizPlayer steps={PAR_STEPS} render={renderPar} autoPlay={false} />;
}

/* ---------------- Visual 2: primitive streams / optionals chart ---------------- */

function Chart() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Primitive streams and optionals chart">
      <JBox x={40} y={20} w={480} h={44} title="Primitive streams avoid boxing; primitive optionals hold primitive values" />
      <JBox x={40} y={80} w={150} title="IntStream" rows={['int sum()', 'int average()']} tone="good" />
      <JBox x={210} y={80} w={150} title="LongStream" rows={['long sum()']} />
      <JBox x={380} y={80} w={150} title="DoubleStream" rows={['double average()']} />
      <JBox x={40} y={170} w={150} title="OptionalInt" rows={['int getAsInt()', 'int orElse(int)']} tone="good" />
      <JBox x={210} y={170} w={150} title="OptionalLong" rows={['long getAsLong()']} />
      <JBox x={380} y={170} w={150} title="OptionalDouble" rows={['double getAsDouble()']} />
      <JArrow x1={190} y1={120} x2={210} y2={120} />
      <JArrow x1={360} y1={120} x2={380} y2={120} />
      <JArrow x1={110} y1={210} x2={140} y2={210} />
      <JArrow x1={360} y1={210} x2={380} y2={210} />
      <JNote x={40} y={270}>{'Primitive streams return primitive specializations — no autoboxing overhead.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Sequential vs parallel timeline',
    caption: 'Fork/join splitting across threads of the common pool.',
    notice: 'Parallel helps large, independent, CPU-bound data — not small streams.',
    component: ParallelTimeline,
  },
  {
    title: 'Primitive streams / optionals chart',
    caption: 'IntStream, LongStream, DoubleStream and OptionalInt/Long/Double.',
    notice: 'Primitive streams avoid autoboxing; use them for numeric pipelines.',
    component: Chart,
  },
];
