import { JBox, JNote } from './javaPrimitives.tsx';

export default function ThreadCreationIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Thread creation and lifecycle">
      <JBox x={40} y={30} w={280} title="Thread creation" rows={['1. extends Thread:', '   class MyThread extends Thread {', '       @Override public void run() { }', '   }', '   new MyThread().start();', '', '2. implements Runnable:', '   new Thread(() -> { }).start();', '', '3. Callable + FutureTask:', '   FutureTask<Integer> ft =', '       new FutureTask<>(() -> 42);', '   new Thread(ft).start();']} />
      <JBox x={380} y={30} w={280} title="Lifecycle states" rows={['NEW: created, not started', 'RUNNABLE: running or ready', 'BLOCKED: waiting for monitor', 'WAITING: wait() indefinitely', 'TIMED_WAITING: sleep, wait(time)', 'TERMINATED: run() completed']} tone="good" />
      <JNote x={120} y={330}>Always call start(), never run(). start() creates new thread; run() executes in current thread.</JNote>
    </svg>
  );
}
