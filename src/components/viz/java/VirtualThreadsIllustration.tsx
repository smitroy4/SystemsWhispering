import { JBox, JNote } from './javaPrimitives.tsx';

export default function VirtualThreadsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Virtual threads (Project Loom)">
      <JBox x={40} y={30} w={280} title="Virtual threads (Java 21+)" rows={['Thread.ofVirtual().start(() -> {', '    // lightweight, millions possible', '});', '', 'Thread.startVirtualThread(() -> { });', 'Executors.newVirtualThreadPerTaskExecutor()', '', 'Stack: few KB (not 1MB)', 'Managed by JVM, not OS']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="Pinning (avoid)" rows={['Virtual thread pinned when:', '  - synchronized block', '  - native method / JNI', '  - File I/O (some)', '  - Object.wait()', 'Pinned = blocks carrier thread', 'Use ReentrantLock instead of synchronized']} tone="bad" />
      
      <JNote x={120} y={330}>Virtual threads = lightweight, millions possible. Avoid pinning (synchronized, JNI). Use for high-throughput I/O.</JNote>
    </svg>
  );
}
