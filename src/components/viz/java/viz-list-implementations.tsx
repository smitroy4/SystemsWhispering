/**
 * list-implementations — 2 visuals.
 * 1. ArrayList growth (capacity doubling) animation (animated).
 * 2. LinkedList node-and-pointer insert/remove (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: ArrayList growth (animated) ---------------- */

const GROW_STEPS: VizStep[] = [
  { id: 'a', description: 'ArrayList created with default capacity 10.', state: { size: 0, cap: 10 } },
  { id: 'b', description: 'Adding the 11th element exceeds capacity → grow to ~16 (1.5x).', state: { size: 11, cap: 16 } },
  { id: 'c', description: 'Adding past 16 → grow to ~24. Elements copied to new array.', state: { size: 17, cap: 24 } },
];

function renderGrow(step: VizStep | undefined) {
  const s = step?.state as { size?: number; cap?: number } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 220" role="img" aria-label="ArrayList capacity growth">
      <JBox x={40} y={20} w={440} h={44} title="ArrayList grows its backing array when full (amortized O(1) add)" />
      <JBox x={40} y={80} w={200} title={'size = ' + s.size} rows={[]} />
      <JBox x={260} y={80} w={220} title={'capacity = ' + s.cap} rows={[]} />
      <JNote x={40} y={170}>{'Growth allocates a larger array and copies references — O(n) occasionally, O(1) amortized.'}</JNote>
    </svg>
  );
}

function ArrayListGrowth() {
  return <VizPlayer steps={GROW_STEPS} render={renderGrow} autoPlay={false} />;
}

/* ---------------- Visual 2: LinkedList node-and-pointer (animated) ---------------- */

const LINK_STEPS: VizStep[] = [
  { id: 'a', description: 'List: A ↔ B ↔ C. Insert D after B.', state: { op: 'insert' } },
  { id: 'b', description: 'Relink pointers: B.next = D, D.prev = B, D.next = C, C.prev = D.', state: { op: 'linked' } },
  { id: 'c', description: 'Remove B: A.next = C, C.prev = A. B is unlinked.', state: { op: 'remove' } },
];

function renderLink(step: VizStep | undefined) {
  const s = step?.state as { op?: string } ?? {};
  const label = s.op === 'insert' ? 'insert D after B' : s.op === 'remove' ? 'remove B' : 'A ↔ B ↔ C';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="LinkedList node-and-pointer insert/remove">
      <JBox x={40} y={20} w={440} h={44} title="LinkedList is a doubly-linked list; insert/remove relink pointers" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} />
      <JNote x={40} y={160}>{'No shifting of elements — only pointer updates. O(1) given the node, O(n) to find it.'}</JNote>
    </svg>
  );
}

function LinkedListNodes() {
  return <VizPlayer steps={LINK_STEPS} render={renderLink} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'ArrayList growth animation',
    caption: 'Backing array grows (roughly 1.5x) when full; elements are copied over.',
    notice: 'Amortized O(1) add; occasional O(n) resize copy.',
    component: ArrayListGrowth,
  },
  {
    title: 'LinkedList node-and-pointer',
    caption: 'Doubly-linked nodes; insert/remove relink next/prev pointers.',
    notice: 'O(1) insert/remove given a node; O(n) random access.',
    component: LinkedListNodes,
  },
];
