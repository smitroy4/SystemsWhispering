import { JBox, JNote } from './javaPrimitives.tsx';

export default function ExecutorFrameworkIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Executor framework, thread pools, Future">
      <JBox x={40} y={30} w={280} title="ThreadPoolExecutor" rows={['ExecutorService es = Executors.newFixedThreadPool(4);', '// corePoolSize=4, max=4', 'es.submit(() -> task);', 'es.execute(() -> task);', '', 'new ThreadPoolExecutor(', '    core, max, keepAlive, unit,', '    queue, factory, handler)', '}']} />
      
      <JBox x={380} y={30} w={280} title="Pool types" rows={['fixed: core=max, unbounded queue', 'cached: core=0, max=∞, 60s keepAlive', 'single: core=max=1, serial', 'scheduled: scheduleAtFixedRate/withFixedDelay']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="Future & Callable" rows={['ExecutorService es = ...', 'Future<Integer> f = es.submit(() -> {', '    return heavyComputation();', '});', 'Integer result = f.get();  // blocks', 'f.cancel(true);  // interrupt if running']} tone="good" />
      
      <JNote x={120} y={330}>ExecutorService manages thread lifecycle. submit() returns Future. Use bounded queues to prevent OOM.</JNote>
    </svg>
  );
}
