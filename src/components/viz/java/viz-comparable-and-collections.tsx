/**
 * comparable-and-collections — 2 visuals.
 * 1. Comparable vs Comparator decision (static).
 * 2. Sort animation with a chosen comparator (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: Comparable vs Comparator ---------------- */

function Decision() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Comparable vs Comparator decision">
      <JBox x={40} y={20} w={480} h={44} title="Comparable = natural order; Comparator = external, multiple orders" />
      <JBox x={40} y={80} w={240} title="Comparable<T>" rows={['compareTo(T other)', 'implemented by the class', 'one natural order']} tone="good" />
      <JBox x={300} y={80} w={220} title="Comparator<T>" rows={['compare(T, T)', 'external, passed in', 'many orderings']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Use Comparator.comparing / thenComparing to build chains of comparisons.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: sort animation (animated) ---------------- */

const SORT_STEPS: VizStep[] = [
  { id: 'a', description: 'Dual-Pivot Quicksort on the array; pivots partition the range.', state: { op: 'partition' } },
  { id: 'b', description: 'Elements less than left pivot go left, greater than right pivot go right.', state: { op: 'swap' } },
  { id: 'c', description: 'Recurse on the three partitions until sorted.', state: { op: 'done' } },
];

function renderSort(step: VizStep | undefined) {
  const s = step?.state as { op?: string } ?? {};
  const label = s.op === 'partition' ? 'partition around pivots' : s.op === 'swap' ? 'swap into place' : 'sorted';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Sort animation">
      <JBox x={40} y={20} w={440} h={44} title="Arrays.sort uses dual-pivot Quicksort for primitives, TimSort for objects" />
      <JBox x={40} y={80} w={440} title={[5, 2, 8, 1, 9].join(', ')} rows={[label]} tone="good" />
      <JNote x={40} y={160}>{'TimSort is stable and exploits existing order; dual-pivot Quicksort is fast for primitives.'}</JNote>
    </svg>
  );
}

function SortAnim() {
  return <VizPlayer steps={SORT_STEPS} render={renderSort} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Comparable vs Comparator',
    caption: 'Natural ordering vs external ordering; Comparator.comparing chains.',
    notice: 'Comparable is implemented by the class; Comparator is injected.',
    component: Decision,
  },
  {
    title: 'Sort animation',
    caption: 'Dual-pivot Quicksort / TimSort with a chosen comparator.',
    notice: 'Object sorts are stable; primitive sorts are not guaranteed stable.',
    component: SortAnim,
  },
];
