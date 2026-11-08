import { JBox, JArrow, JNote } from './javaPrimitives.tsx';

export default function InterThreadCommunicationIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="wait, notify, notifyAll">
      <JBox x={40} y={30} w={280} title="Producer" rows={['synchronized (buffer) {', '    while (buffer.full()) {', '        buffer.wait();  // release lock, wait', '    }', '    buffer.add(item);', '    buffer.notifyAll();  // wake consumers', '}']} />
      <JArrow x1={320} y1={110} x2={380} y2={110} label="notify" />
      <JBox x={380} y={30} w={280} title="Consumer" rows={['synchronized (buffer) {', '    while (buffer.empty()) {', '        buffer.wait();', '    }', '    item = buffer.remove();', '    buffer.notifyAll();  // wake producers', '}']} tone="good" />
      <JNote x={120} y={330}>wait() releases lock, re-acquires on wake. Always in while loop (spurious wakeups). notifyAll wakes all waiters.</JNote>
    </svg>
  );
}
