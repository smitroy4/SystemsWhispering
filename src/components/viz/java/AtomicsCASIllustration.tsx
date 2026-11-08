import { JBox, JNote } from './javaPrimitives.tsx';

export default function AtomicsCASIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Atomic variables and CAS">
      <JBox x={40} y={30} w={280} title="Atomic classes" rows={['AtomicInteger, AtomicLong', 'AtomicReference<T>', 'AtomicIntegerArray', 'AtomicLongArray', 'AtomicReferenceArray<T>', '', 'incrementAndGet()', 'getAndIncrement()', 'compareAndSet(expect, update)']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="CAS (Compare-And-Swap)" rows={['boolean compareAndSet(expected, update)', '// Atomically:', 'if (value == expected) {', '    value = update;', '    return true;', '}', 'return false;', '', 'Optimistic: retry on failure']} tone="good" />
      
      <JNote x={120} y={330}>CAS = hardware atomic. Optimistic locking: retry on conflict. Non-blocking, no locks needed.</JNote>
    </svg>
  );
}
