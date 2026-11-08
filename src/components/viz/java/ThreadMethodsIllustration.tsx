import { JBox, JNote } from './javaPrimitives.tsx';

export default function ThreadMethodsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Thread methods: sleep, join, yield, interrupt">
      <JBox x={40} y={30} w={280} title="sleep / yield" rows={['Thread.sleep(ms)  // timed wait', '  throws InterruptedException', 'Thread.yield()  // hint to scheduler', '  not guaranteed to yield', '', 'TimeUnit.SECONDS.sleep(1)  // readable']} />
      
      <JBox x={380} y={30} w={280} title="join" rows={['thread.join()      // wait forever', 'thread.join(ms)    // timed wait', 'Throws InterruptedException', 'Current thread waits for target to die']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="interrupt" rows={['thread.interrupt()  // sets flag', 'InterruptedException in sleep/wait/join', 'Thread.currentThread().isInterrupted()', 'Thread.interrupted()  // clears flag', 'Handle promptly! Don\'t swallow.']} tone="bad" />
      
      <JNote x={120} y={330}>sleep pauses current thread. join waits for thread completion. interrupt = polite cancellation request.</JNote>
    </svg>
  );
}
