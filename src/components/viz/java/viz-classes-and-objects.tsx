/**
 * classes-and-objects — 2 visuals.
 * 1. Class blueprint → two heap objects (static).
 * 2. Reference aliasing and identity (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: class blueprint → two heap objects ---------------- */

function Blueprint() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Class blueprint creates two heap objects">
      <JBox x={40} y={20} w={520} h={44} title="A class is a blueprint; new creates objects on the heap" />
      <JBox x={40} y={80} w={260} title="Class: Point" rows={['int x, y;', 'Point(int x, int y) {...}']} />
      <JBox x={320} y={80} w={240} title="Heap: p1" rows={['Point@1a', 'x = 3', 'y = 4']} tone="good" />
      <JBox x={320} y={200} w={240} title="Heap: p2" rows={['Point@2b', 'x = 7', 'y = 8']} tone="good" />
      <JArrow x1={300} y1={135} x2={320} y2={135} />
      <JArrow x1={300} y1={255} x2={320} y2={255} />
      <JNote x={40} y={265}>{'Each new Point allocates a fresh object on the heap with its own field values.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: reference aliasing and identity ---------------- */

function Aliasing() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Reference aliasing and identity">
      <JBox x={40} y={20} w={520} h={44} title="Copying a reference copies the handle — both point to the same object" />
      <JBox x={40} y={80} w={260} title="Stack" rows={['a → 0x1a', 'b → 0x1a']} />
      <JBox x={320} y={80} w={240} title="Heap object 0x1a" rows={['value = 42', 'a and b share it']} tone="good" />
      <JArrow x1={300} y1={108} x2={320} y2={108} />
      <JNote x={40} y={200}>{'a == b is true (same handle). equals compares content when overridden.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Class blueprint → two heap objects',
    caption: 'One class defines the shape; new creates independent heap objects.',
    notice: 'Each object has its own fields and identity (heap address).',
    component: Blueprint,
  },
  {
    title: 'Reference aliasing and identity',
    caption: 'Two references can point at the same heap object.',
    notice: '== compares handles; use equals for content comparison.',
    component: Aliasing,
  },
];
