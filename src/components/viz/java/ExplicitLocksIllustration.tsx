import { JBox, JNote } from './javaPrimitives.tsx';

export default function ExplicitLocksIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="ReentrantLock, ReadWriteLock, Semaphore, StampedLock">
      <JBox x={40} y={30} w={300} title="ReentrantLock" rows={['Lock lock = new ReentrantLock();', 'lock.lock();', 'try {', '    // critical section', '} finally {', '    lock.unlock();', '}', '', 'Features:', '  lockInterruptibly()', '  tryLock() / tryLock(timeout)', '  Condition: lock.newCondition()']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="ReadWriteLock" rows={['ReadWriteLock rwl = new ReentrantReadWriteLock();', 'Lock r = rwl.readLock();', 'Lock w = rwl.writeLock();', '', 'r.lock();  // multiple readers OK', '// ... read', 'r.unlock();', '', 'w.lock();  // exclusive', '// ... write', 'w.unlock();']} tone="good" />
      
      <JNote x={120} y={330}>Lock = explicit, interruptible, tryLock. ReadWriteLock = many readers, one writer. StampedLock = optimistic reads.</JNote>
    </svg>
  );
}
