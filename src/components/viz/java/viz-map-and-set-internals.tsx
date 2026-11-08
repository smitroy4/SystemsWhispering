/**
 * map-and-set-internals — 2 visuals.
 * 1. HashMap bucket array with hash → index, collisions, treeify, resize (animated).
 * 2. TreeMap red-black insert (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: HashMap bucket array (animated) ---------------- */

const HASH_STEPS: VizStep[] = [
  { id: 'a', description: 'hash(key) → index; put into bucket chain.', state: { op: 'put' } },
  { id: 'b', description: 'Collision: same bucket → chain grows (linked list).', state: { op: 'collide' } },
  { id: 'c', description: 'Chain exceeds threshold → treeify to red-black tree.', state: { op: 'treeify' } },
  { id: 'd', description: 'Load factor exceeded → resize/rehash into a bigger table.', state: { op: 'resize' } },
];

function renderHash(step: VizStep | undefined) {
  const s = step?.state as { op?: string } ?? {};
  const label = s.op === 'put' ? 'bucket[3] ← entry' : s.op === 'collide' ? 'collision → chain' : s.op === 'treeify' ? 'treeify (threshold 8)' : 'resize/rehash';
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="HashMap bucket array">
      <JBox x={40} y={20} w={480} h={44} title="HashMap: hash → bucket index; collisions chain; treeify; resize" />
      <JBox x={40} y={80} w={480} title={label} rows={[]} tone="good" />
      <JNote x={40} y={165}>{'Default capacity 16, load factor 0.75. Treeify at 8, untreeify at 6.'}</JNote>
    </svg>
  );
}

function HashMapBuckets() {
  return <VizPlayer steps={HASH_STEPS} render={renderHash} autoPlay={false} />;
}

/* ---------------- Visual 2: TreeMap red-black insert (static) ---------------- */

function TreeMapInsert() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="TreeMap red-black tree insert">
      <JBox x={40} y={20} w={480} h={44} title="TreeMap is a red-black tree — insert rebalances with rotations and recoloring" />
      <JBox x={40} y={80} w={240} title="Insert 20" rows={['red node', 'rotate if needed', 'recolor up the tree']} tone="good" />
      <JBox x={300} y={80} w={220} title="Guarantees" rows={['O(log n) add/remove', 'sorted order', 'black-balanced']} />
      <JArrow x1={280} y1={130} x2={300} y2={130} />
      <JNote x={40} y={200}>{'Red-black properties keep the tree balanced after every insertion and deletion.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'HashMap bucket array',
    caption: 'hash → index; collisions chain; treeify at threshold; resize/rehash.',
    notice: 'Treeify turns long chains into a red-black tree (O(log n) worst case).',
    component: HashMapBuckets,
  },
  {
    title: 'TreeMap red-black insert',
    caption: 'Sorted map backed by a red-black tree; rebalancing keeps O(log n).',
    notice: 'Keys must be Comparable or a Comparator must be supplied.',
    component: TreeMapInsert,
  },
];
