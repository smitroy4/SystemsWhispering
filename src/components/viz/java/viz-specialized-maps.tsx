/**
 * specialized-maps — 2 visuals.
 * 1. Specialized maps classification (static).
 * 2. IdentityHashMap == vs equals key demo (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: specialized maps classification ---------------- */

function Classification() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="Specialized maps classification">
      <JBox x={40} y={20} w={520} h={44} title="Specialized Map implementations for specific use cases" />
      <JBox x={40} y={80} w={140} title="EnumMap" rows={['ordinal-indexed array', 'extremely fast']} tone="good" />
      <JBox x={200} y={80} w={140} title="IdentityHashMap" rows={['keys by == not equals']} />
      <JBox x={360} y={80} w={140} title="WeakHashMap" rows={['weak keys; entries collected']} />
      <JBox x={40} y={170} w={140} title="ConcurrentHashMap" rows={['concurrent access', 'striped locking']} tone="good" />
      <JBox x={200} y={170} w={140} title="LinkedHashMap" rows={['insertion/access order']} />
      <JBox x={360} y={170} w={140} title="TreeMap" rows={['red-black tree', 'sorted keys']} />
      <JArrow x1={180} y1={120} x2={200} y2={120} />
      <JArrow x1={340} y1={120} x2={360} y2={120} />
      <JArrow x1={110} y1={210} x2={140} y2={210} />
      <JArrow x1={340} y1={210} x2={360} y2={210} />
      <JNote x={40} y={270}>{'Choose EnumMap for enum keys, WeakHashMap for caches, ConcurrentHashMap for shared mutable state.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: IdentityHashMap == vs equals ---------------- */

function Identity() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="IdentityHashMap == vs equals">
      <JBox x={40} y={20} w={480} h={44} title="IdentityHashMap compares keys by reference (==), not equals" />
      <JBox x={40} y={80} w={240} title="Two equal Integers" rows={['new Integer(1)', 'new Integer(1)', 'equals → true']} tone="good" />
      <JBox x={320} y={80} w={200} title="IdentityHashMap" rows={['== → false', 'two distinct keys']} />
      <JArrow x1={280} y1={120} x2={320} y2={120} />
      <JNote x={40} y={175}>{'Use IdentityHashMap when you need identity (reference) semantics rather than value equality.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Specialized maps classification',
    caption: 'EnumMap, IdentityHashMap, WeakHashMap, ConcurrentHashMap, LinkedHashMap, TreeMap.',
    notice: 'Each targets a specific key type or access pattern.',
    component: Classification,
  },
  {
    title: 'IdentityHashMap == vs equals',
    caption: 'IdentityHashMap keys are compared with == (reference equality).',
    notice: 'Two equal but distinct objects are different keys.',
    component: Identity,
  },
];
