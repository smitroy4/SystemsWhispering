/**
 * queue-and-priorityqueue — 2 visuals.
 * 1. FIFO queue and Deque both-ends (static).
 * 2. PriorityQueue binary heap sift-up/sift-down (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: FIFO queue and Deque ---------------- */

function QueueDeque() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 240" role="img" aria-label="FIFO queue and Deque both ends">
      <JBox x={40} y={20} w={520} h={44} title="Queue is FIFO; Deque adds/removes at both ends" />
      <JBox x={40} y={80} w={260} title="Queue (FIFO)" rows={['offer → rear', 'poll ← front', 'A → B → C']} tone="good" />
      <JBox x={320} y={80} w={240} title="Deque (both ends)" rows={['addFirst / addLast', 'removeFirst / removeLast']} />
      <JArrow x1={300} y1={120} x2={320} y2={120} />
      <JNote x={40} y={175}>{'ArrayDeque is a circular array-backed Deque — the default deque implementation.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: PriorityQueue binary heap (animated) ---------------- */

const HEAP_STEPS: VizStep[] = [
  { id: 'a', description: 'Insert 5 at end, then sift-up while smaller than parent.', state: { op: 'insert' } },
  { id: 'b', description: 'Remove root: move last element to root, sift-down.', state: { op: 'remove' } },
  { id: 'c', description: 'Array index i → children 2i+1, 2i+2; heap property maintained.', state: { op: 'property' } },
];

function renderHeap(step: VizStep | undefined) {
  const s = step?.state as { op?: string } ?? {};
  const label = s.op === 'insert' ? 'insert + sift-up' : s.op === 'remove' ? 'remove root + sift-down' : 'heap property';
  return (
    <svg className="viz-svg" viewBox="0 0 520 220" role="img" aria-label="PriorityQueue binary heap">
      <JBox x={40} y={20} w={440} h={44} title="PriorityQueue is a binary heap — smallest at root (min-heap)" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'offer/poll are O(log n); peek is O(1). Iteration order is not sorted.'}</JNote>
    </svg>
  );
}

function BinaryHeap() {
  return <VizPlayer steps={HEAP_STEPS} render={renderHeap} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'FIFO queue and Deque',
    caption: 'Queue is FIFO; Deque adds/removes at both ends.',
    notice: 'ArrayDeque is the default Deque; it is not thread-safe.',
    component: QueueDeque,
  },
  {
    title: 'PriorityQueue binary heap',
    caption: 'Array ↔ tree view; sift-up on insert, sift-down on removal.',
    notice: 'Head is the least element; iteration is not in sorted order.',
    component: BinaryHeap,
  },
];
