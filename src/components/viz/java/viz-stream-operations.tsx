/**
 * stream-operations — 2 visuals.
 * 1. Marble-diagram per operation: filter, map, flatMap, sorted, distinct, limit, reduce, collect (animated).
 * 2. Stateless vs stateful classification (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: marble diagram per operation (animated) ---------------- */

const OP_STEPS: VizStep[] = [
  { id: 'filter', description: 'filter keeps only matching elements.', state: { op: 'filter' } },
  { id: 'map', description: 'map transforms each element to a new value.', state: { op: 'map' } },
  { id: 'flatMap', description: 'flatMap flattens each element into a stream of elements.', state: { op: 'flatMap' } },
  { id: 'collect', description: 'collect gathers results into a collection.', state: { op: 'collect' } },
];

function renderOp(step: VizStep | undefined) {
  const s = step?.state as { op?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Stream operation marble diagram">
      <JBox x={40} y={20} w={440} h={44} title="Marble diagram: one element at a time through each operation" />
      <JBox x={40} y={80} w={440} title={s.op} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'filter/map/distinct are stateless; sorted/reduce/collect are stateful.'}</JNote>
    </svg>
  );
}

function OpMarble() {
  return <VizPlayer steps={OP_STEPS} render={renderOp} autoPlay={false} />;
}

/* ---------------- Visual 2: stateless vs stateful ---------------- */

function Classification() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Stateless vs stateful operation classification">
      <JBox x={40} y={20} w={480} h={44} title="Stateless ops process one element; stateful ops buffer/reorder" />
      <JBox x={40} y={80} w={240} title="Stateless" rows={['filter, map', 'flatMap, peek', 'one element at a time']} tone="good" />
      <JBox x={300} y={80} w={240} title="Stateful" rows={['sorted, distinct', 'limit, skip', 'reduce, collect', 'buffer needed']} />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Stateful operations may need to see all elements before producing any output.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Marble diagram per operation',
    caption: 'filter, map, flatMap, sorted, distinct, limit, reduce, collect — element by element.',
    notice: 'Stateless ops emit per element; stateful ops may buffer.',
    component: OpMarble,
  },
  {
    title: 'Stateless vs stateful classification',
    caption: 'Which stream operations need to buffer or reorder elements.',
    notice: 'Stateful ops (sorted, distinct) require seeing more of the stream.',
    component: Classification,
  },
];
