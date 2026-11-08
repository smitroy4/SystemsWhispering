import { JBox, JNote } from './javaPrimitives.tsx';

export default function ListImplementationsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="List implementations: ArrayList, LinkedList, Vector, Stack">
      <JBox x={40} y={30} w={280} title="ArrayList" rows={['Backed by Object[]', 'get/set: O(1)', 'append: amortized O(1)', 'insert/remove middle: O(n)', 'Cache-friendly (contiguous)', 'Default choice for most cases']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="LinkedList" rows={['Doubly-linked nodes', 'get/set: O(n)', 'addFirst/last: O(1)', 'insert/remove known pos: O(1)', 'Not cache-friendly', 'Implements Deque']} />
      
      <JBox x={40} y={180} w={280} title="Vector (legacy)" rows={['Synchronized (all methods)', 'Grows 2x (vs 1.5x)', 'Slower due to sync', 'Use ArrayList + Collections.synchronizedList']} tone="bad" />
      
      <JBox x={380} y={180} w={280} title="Stack (legacy)" rows={['extends Vector', 'push, pop, peek', 'search, empty', 'Use ArrayDeque instead', 'ArrayDeque: faster, no sync', 'Implements Deque']} tone="bad" />
      
      <JNote x={120} y={330}>Default: ArrayList. Queue/Deque → ArrayDeque. Stack/Vector legacy — avoid in new code.</JNote>
    </svg>
  );
}
