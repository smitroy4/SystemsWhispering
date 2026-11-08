/**
 * object-memory-and-copy-semantics — 2 visuals.
 * 1. Stack/heap pass-by-value: reference is a value (static).
 * 2. Shallow vs deep copy object graph (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: pass-by-value reference ---------------- */

function PassByValueRef() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 260" role="img" aria-label="Pass-by-value reference is a value">
      <JBox x={40} y={20} w={520} h={44} title="Java is pass-by-value: a reference argument passes a copy of the handle" />
      <JBox x={40} y={80} w={240} title="Caller stack" rows={['obj → 0x1a']} />
      <JBox x={320} y={80} w={240} title="Callee stack" rows={['obj → 0x1a (copy)']} />
      <JBox x={180} y={150} w={240} title="Heap object 0x1a" rows={['value = 42', 'shared by both']} tone="good" />
      <JArrow x1={280} y1={108} x2={320} y2={108} />
      <JArrow x1={140} y1={135} x2={180} y2={135} />
      <JArrow x1={400} y1={135} x2={180} y2={215} />
      <JNote x={40} y={230}>{'The callee gets a copy of the handle — both refer to the same object, but reassignment is not visible to the caller.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: shallow vs deep copy ---------------- */

function ShallowDeep() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="Shallow vs deep copy object graph">
      <JBox x={40} y={20} w={520} h={44} title="Shallow copy copies references; deep copy clones nested objects" />
      <JBox x={40} y={80} w={260} title="Original" rows={['Team', 'players → [0x1a, 0x1b]']} />
      <JBox x={320} y={80} w={240} title="Shallow copy" rows={['Team', 'players → [0x1a, 0x1b] (shared)']} tone="bad" />
      <JArrow x1={300} y1={130} x2={320} y2={130} />
      <JBox x={40} y={200} w={260} title="Deep copy" rows={['Team', 'players → [0x1c, 0x1d] (clones)']} tone="good" />
      <JNote x={40} y={260}>{'Shallow: nested objects are shared. Deep copy: clone nested objects so edits do not leak.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Pass-by-value reference',
    caption: 'A reference argument passes a copy of the handle to the same object.',
    notice: 'Reassigning the parameter does not affect the caller’s variable.',
    component: PassByValueRef,
  },
  {
    title: 'Shallow vs deep copy',
    caption: 'Shallow copies references; deep copies clone the object graph.',
    notice: 'Use a copy constructor or clone for deep copy; watch mutable nested fields.',
    component: ShallowDeep,
  },
];
