/**
 * static-and-final — 2 visuals.
 * 1. Static area vs instance area (static).
 * 2. final reference vs immutable object (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: static area vs instance area ---------------- */

function StaticVsInstance() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Static area vs instance area">
      <JBox x={40} y={20} w={520} h={44} title="static members live once in the class area; instance fields live per object" />
      <JBox x={40} y={80} w={260} title="Class area (static)" rows={['static int count = 0;', 'shared by all objects']} tone="good" />
      <JBox x={320} y={80} w={240} title="Heap: obj1" rows={['int count', 'int total']} />
      <JBox x={320} y={190} w={240} title="Heap: obj2" rows={['int count', 'int total']} />
      <JArrow x1={300} y1={135} x2={320} y2={135} />
      <JArrow x1={300} y1={245} x2={320} y2={245} />
      <JNote x={40} y={260}>{'Static fields are initialized once at class loading; instance fields once per new.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: final reference vs immutable object ---------------- */

function FinalVsImmutable() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 260" role="img" aria-label="final reference vs immutable object">
      <JBox x={40} y={20} w={520} h={44} title="final makes the reference unassignable — not the object immutable" />
      <JBox x={40} y={80} w={260} title="final ref" rows={['final List<String> list;', 'list = new ArrayList<>();', 'list = null;  ✗']} tone="bad" />
      <JBox x={320} y={80} w={240} title="Immutable" rows={['String s = "hi";', 's cannot change', 'fields final, no setters']} tone="good" />
      <JArrow x1={300} y1={108} x2={320} y2={108} />
      <JNote x={40} y={160}>{'final reference: handle cannot be reassigned. Immutable object: state cannot change after construction.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Static area vs instance area',
    caption: 'Static members live once; instance fields live per object on the heap.',
    notice: 'Static fields initialize once at class load; instance fields per new.',
    component: StaticVsInstance,
  },
  {
    title: 'final reference vs immutable object',
    caption: 'final prevents reassignment; immutability prevents state change.',
    notice: 'A final reference to a mutable object still allows mutation of that object.',
    component: FinalVsImmutable,
  },
];
