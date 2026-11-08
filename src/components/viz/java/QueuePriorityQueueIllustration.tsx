import { JBox, JNote } from './javaPrimitives.tsx';

export default function QueuePriorityQueueIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Queue, Deque, ArrayDeque, PriorityQueue">
      <JBox x={40} y={30} w={280} title="Queue (FIFO)" rows={['offer(e) / add(e) → enqueue', 'poll() / remove() → dequeue', 'peek() / element() → head', 'LinkedList, ArrayDeque, PriorityQueue']} />
      
      <JBox x={380} y={30} w={280} title="Deque (double-ended)" rows={['addFirst / addLast', 'offerFirst / offerLast', 'removeFirst / removeLast', 'pollFirst / pollLast', 'peekFirst / peekLast', 'ArrayDeque: fast, no sync']} />
      
      <JBox x={40} y={180} w={280} title="PriorityQueue (min-heap)" rows={['Elements ordered by Comparable/Comparator', 'poll() → smallest element', 'O(log n) add/poll', 'Not thread-safe', 'Natural ordering: smallest first', 'Custom: new PriorityQueue<>(comp)']} tone="good" />
      
      <JNote x={120} y={330}>Queue = FIFO. Deque = both ends. ArrayDeque preferred. PriorityQueue = sorted access, O(log n).</JNote>
    </svg>
  );
}
