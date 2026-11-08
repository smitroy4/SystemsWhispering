/**
 * streams-creation-and-architecture — 2 visuals.
 * 1. Source → intermediate → terminal pipeline (animated).
 * 2. Lazy evaluation element-by-element (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: pipeline anatomy (animated) ---------------- */

const PIPE_STEPS: VizStep[] = [
  { id: 'a', description: 'Source: collection or stream generator.', state: { stage: 'source' } },
  { id: 'b', description: 'Intermediate ops (filter, map) are lazy — nothing happens yet.', state: { stage: 'intermediate' } },
  { id: 'c', description: 'Terminal op (collect, forEach) triggers the pipeline.', state: { stage: 'terminal' } },
];

function renderPipe(step: VizStep | undefined) {
  const s = step?.state as { stage?: string } ?? {};
  const active = (p: string) => s.stage === p ? 'active' : 'default';
  return (
    <svg className="viz-svg" viewBox="0 0 560 200" role="img" aria-label="Stream pipeline anatomy">
      <JBox x={40} y={20} w={480} h={44} title="Stream pipeline: source → intermediate → terminal" />
      <JBox x={40} y={80} w={140} title="Source" rows={['collection']} tone={active('source')} />
      <JBox x={200} y={80} w={160} title="Intermediate" rows={['filter, map — lazy']} tone={active('intermediate')} />
      <JBox x={380} y={80} w={140} title="Terminal" rows={['collect, forEach']} tone={active('terminal')} />
      <JArrow x1={180} y1={108} x2={200} y2={108} tone={active('intermediate')} />
      <JArrow x1={360} y1={108} x2={380} y2={108} tone={active('terminal')} />
      <JNote x={40} y={160}>{'Intermediate operations return a new stream and are lazy until a terminal operation runs.'}</JNote>
    </svg>
  );
}

function Pipeline() {
  return <VizPlayer steps={PIPE_STEPS} render={renderPipe} autoPlay={false} />;
}

/* ---------------- Visual 2: lazy evaluation element-by-element ---------------- */

const LAZY_STEPS: VizStep[] = [
  { id: 'a', description: 'Elements flow one at a time through filter then map.', state: { elem: 1 } },
  { id: 'b', description: 'Each element completes all intermediate ops before the next.', state: { elem: 2 } },
  { id: 'c', description: 'Terminal op consumes the final result per element.', state: { elem: 3 } },
];

function renderLazy(step: VizStep | undefined) {
  const s = step?.state as { elem?: number } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="Lazy evaluation element by element">
      <JBox x={40} y={20} w={440} h={44} title="Lazy evaluation: elements flow one at a time through the pipeline" />
      <JBox x={40} y={80} w={440} title={'element ' + (s.elem ?? 1)} rows={[]} tone="good" />
      <JNote x={40} y={155}>{'No intermediate results are stored; each element is processed end-to-end before the next.'}</JNote>
    </svg>
  );
}

function LazyEval() {
  return <VizPlayer steps={LAZY_STEPS} render={renderLazy} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Source → intermediate → terminal pipeline',
    caption: 'Stream anatomy: source creates, intermediate transforms lazily, terminal executes.',
    notice: 'Intermediate operations are lazy; nothing runs until a terminal operation.',
    component: Pipeline,
  },
  {
    title: 'Lazy evaluation',
    caption: 'Elements flow one at a time; each completes all intermediate ops before the next.',
    notice: 'Short-circuiting ops (findFirst, limit) can stop early.',
    component: LazyEval,
  },
];
