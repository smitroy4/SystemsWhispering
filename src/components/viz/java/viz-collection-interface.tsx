/**
 * collection-interface — 2 visuals.
 * 1. Bulk operations as set algebra (static).
 * 2. Array vs fixed-size view (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: bulk operations as set algebra ---------------- */

function SetAlgebra() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Bulk operations as set algebra">
      <JBox x={40} y={20} w={520} h={44} title="Bulk operations are set algebra over the collection's elements" />
      <JBox x={40} y={80} w={180} title="addAll" rows={['A ∪ B', 'add everything from B']} tone="good" />
      <JBox x={240} y={80} w={180} title="retainAll" rows={['A ∩ B', 'keep only common']} />
      <JBox x={440} y={80} w={120} title="removeAll" rows={['A − B', 'drop elements in B']} tone="bad" />
      <JArrow x1={220} y1={130} x2={240} y2={130} />
      <JArrow x1={420} y1={130} x2={440} y2={130} />
      <JNote x={40} y={200}>{'Bulk operations take a Collection and modify the target in place.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: array vs fixed-size view ---------------- */

function ArrayView() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Array vs fixed-size list view">
      <JBox x={40} y={20} w={480} h={44} title="Arrays.asList is a fixed-size view backed by the original array" />
      <JBox x={40} y={80} w={260} title="String[] array" rows={['[A, B, C]', 'fixed length 3']} />
      <JBox x={320} y={80} w={200} title="List view" rows={['fixed-size', 'structural add → throws']} tone="bad" />
      <JArrow x1={300} y1={120} x2={320} y2={120} />
      <JNote x={40} y={180}>{'Setting an element updates both; add/remove on the view throws UnsupportedOperationException.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Bulk operations as set algebra',
    caption: 'addAll = union, retainAll = intersection, removeAll = difference.',
    notice: 'These modify the target collection in place.',
    component: SetAlgebra,
  },
  {
    title: 'Array vs fixed-size view',
    caption: 'Arrays.asList wraps an array as a fixed-size List.',
    notice: 'Structural changes (add/remove) are not supported on the view.',
    component: ArrayView,
  },
];
