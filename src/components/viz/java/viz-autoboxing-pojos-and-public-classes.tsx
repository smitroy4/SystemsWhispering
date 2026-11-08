/**
 * autoboxing-pojos-and-public-classes — 2 visuals.
 * 1. Box / unbox flow; Integer cache -128..127 (static).
 * 2. POJO and record anatomy (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: boxing / Integer cache ---------------- */

function Boxing() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Boxing and Integer cache">
      <JBox x={40} y={20} w={520} h={44} title="Autoboxing converts primitive ↔ wrapper; Integer caches -128..127" />
      <JBox x={40} y={80} w={260} title="Boxing" rows={['Integer b = 5;', 'int → Integer']} tone="good" />
      <JBox x={320} y={80} w={240} title="Unboxing" rows={['int n = b;', 'Integer → int']} tone="good" />
      <JArrow x1={300} y1={108} x2={320} y2={108} />
      <JBox x={40} y={160} w={520} title="Cache" rows={['Integer.valueOf(127) == Integer.valueOf(127) → true (cached)', 'Integer.valueOf(128) == Integer.valueOf(128) → false (not cached)']} />
      <JNote x={40} y={235}>{'Use == only for primitives; use equals for boxed values. Unboxing null throws NullPointerException.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: POJO and record anatomy ---------------- */

function PojoRecord() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 260" role="img" aria-label="POJO and record anatomy">
      <JBox x={40} y={20} w={520} h={44} title="POJO vs record — records are concise, immutable data carriers" />
      <JBox x={40} y={80} w={260} title="POJO" rows={['class Point {', '  private int x, y;', '  public Point(...) {...}', '  getters/setters', '  equals/hashCode/toString', '}']} />
      <JBox x={320} y={80} w={240} title="record Point(int x, int y) {}" rows={['compiler generates:', 'constructor, accessors', 'equals, hashCode, toString', 'immutable fields']} tone="good" />
      <JArrow x1={300} y1={130} x2={320} y2={130} />
      <JNote x={40} y={195}>{'Records model data transparently; POJOs give full control over mutability and behavior.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Box / unbox flow',
    caption: 'Autoboxing primitive ↔ wrapper; Integer cache -128..127.',
    notice: 'Use equals for boxed values; == compares identities.',
    component: Boxing,
  },
  {
    title: 'POJO and record anatomy',
    caption: 'Records generate constructor, accessors, equals, hashCode, toString.',
    notice: 'Record fields are final and the record is immutable (shallowly).',
    component: PojoRecord,
  },
];
