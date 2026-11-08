import { JBox, JNote } from './javaPrimitives.tsx';

export default function ThreadLocalIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="ThreadLocal and memory leaks">
      <JBox x={40} y={30} w={280} title="ThreadLocal basics" rows={['ThreadLocal<String> tl = new ThreadLocal<>();', 'tl.set("value");  // per-thread', 'String v = tl.get();', 'tl.remove();  // cleanup!', '', 'Each thread has own copy', 'InheritableThreadLocal: parent→child']} />
      
      <JBox x={380} y={30} w={280} title="Common use cases" rows={['Request context (user, trace ID)', 'DB connection per thread', 'SimpleDateFormat (not thread-safe)', 'Transaction management']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="Memory leak risk" rows={['Thread pool + ThreadLocal = leak!', 'Thread reused, value never removed', 'Value stuck until thread dies', 'Fix: try-finally remove()', 'try { tl.set(...); work();', '} finally { tl.remove(); }']} tone="bad" />
      
      <JNote x={120} y={330}>ThreadLocal = per-thread storage. Always remove() in finally. Pooled threads leak if not cleaned.</JNote>
    </svg>
  );
}
