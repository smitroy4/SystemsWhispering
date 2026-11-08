/**
 * object-class-contract — 2 visuals.
 * 1. equals / hashCode contract diagram (static).
 * 2. HashMap bucket: mutated key lost (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: equals / hashCode contract ---------------- */

function Contract() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 240" role="img" aria-label="equals hashCode contract">
      <JBox x={40} y={20} w={520} h={44} title="equals and hashCode contract: equal objects must have equal hashCodes" />
      <JBox x={40} y={80} w={240} title="equals(a, b) = true" rows={['implies']} tone="good" />
      <JBox x={300} y={80} w={240} title="hashCode(a) == hashCode(b)" rows={['required']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Violating the contract breaks hash-based collections (HashMap, HashSet).'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: HashMap bucket: mutated key lost ---------------- */

function LostKey() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Mutated HashMap key is lost">
      <JBox x={40} y={20} w={480} h={44} title="Mutating a key after put() loses it in the HashMap bucket" />
      <JBox x={40} y={80} w={240} title="put(key, value)" rows={['key.hashCode() = 5', 'stored in bucket 5']} tone="good" />
      <JBox x={300} y={80} w={240} title="key.field changes" rows={['key.hashCode() now 9', 'get(key) looks in bucket 9']} tone="bad" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Key hashCode must be immutable while the key is in a HashMap.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'equals / hashCode contract',
    caption: 'Equal objects must have equal hashCodes.',
    notice: 'Always override hashCode when overriding equals.',
    component: Contract,
  },
  {
    title: 'HashMap bucket: mutated key lost',
    caption: "Changing a key's hashCode moves it to another bucket — the entry is lost.",
    notice: "Never mutate a key's hashCode-relevant fields after putting it in a HashMap.",
    component: LostKey,
  },
];
