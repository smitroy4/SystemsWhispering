import { JBox, JNote } from './javaPrimitives.tsx';

export default function ForkJoinIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="ForkJoinPool and work stealing">
      <JBox x={40} y={30} w={300} title="ForkJoinPool" rows={['ForkJoinPool.commonPool()', '  // shared, parallelism = CPU-1', 'ForkJoinPool pool = new ForkJoinPool(4);', 'pool.submit(task)', 'pool.invoke(task)  // blocks until done']} />
      
      <JBox x={380} y={30} w={280} title="RecursiveTask (returns value)" rows={['class SumTask extends RecursiveTask<Long> {', '    long[] arr; int lo, hi;', '    protected Long compute() {', '        if (hi - lo <= THRESHOLD) {', '            return sumSequentially();', '        }', '        int mid = (lo + hi) / 2;', '        SumTask left = new SumTask(arr, lo, mid);', '        SumTask right = new SumTask(arr, mid, hi);', '        left.fork();', '        return right.compute() + left.join();', '    }', '}']} tone="good" />
      
      <JNote x={120} y={330}>ForkJoin = divide & conquer. Work stealing: idle threads steal from busy threads\' queues.</JNote>
    </svg>
  );
}
