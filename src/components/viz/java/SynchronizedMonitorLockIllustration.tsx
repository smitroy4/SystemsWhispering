import { JBox, JNote } from './javaPrimitives.tsx';

export default function SynchronizedMonitorLockIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="synchronized and monitor locks">
      <JBox x={40} y={30} w={280} title="synchronized methods" rows={['class Counter {', '    private int count = 0;', '    public synchronized void inc() {', '        count++;', '    }', '    public synchronized int get() {', '        return count;', '    }', '}', 'Locks on \'this\' instance']} />
      
      <JBox x={380} y={30} w={280} title="synchronized blocks" rows={['class Counter {', '    private int count = 0;', '    private final Object lock = new Object();', '    void inc() {', '        synchronized (lock) { count++; }', '    }', '    int get() {', '        synchronized (lock) { return count; }', '    }', '}', 'Fine-grained: different locks for diff data']} tone="good" />
      
      <JNote x={120} y={330}>synchronized = intrinsic lock. Every object has monitor. Block form = finer control. static sync = class monitor.</JNote>
    </svg>
  );
}
