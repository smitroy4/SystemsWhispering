import { JBox, JNote } from './javaPrimitives.tsx';

export default function ParallelStreamsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Parallel streams and primitive optionals">
      <JBox x={40} y={30} w={300} title="Parallel stream" rows={['list.parallelStream()', '  .filter(x -> x > 5)', '  .map(x -> x * 2)', '  .collect(toList());', '', 'Uses common ForkJoinPool', 'Spliterator splits work', 'Order not guaranteed (unless forEachOrdered)']} />
      
      <JBox x={380} y={30} w={280} title="When to use parallel" rows={['✅ Large datasets (10k+ elements)', '✅ CPU-intensive per element', '✅ Independent operations', '', '❌ Small datasets (overhead > gain)', '❌ Shared mutable state', '❌ I/O bound operations', '❌ Order-sensitive without forEachOrdered']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="Primitive streams" rows={['IntStream, LongStream, DoubleStream', 'No boxing/unboxing overhead', 'IntStream.range(1, 1000000)', '    .parallel()', '    .sum()  // fast!', '', 'Specialized: sum, average, summaryStatistics']} tone="good" />
      
      <JBox x={380} y={180} w={280} title="Primitive Optionals" rows={['OptionalInt, OptionalLong, OptionalDouble', 'int value = optInt.orElse(0);', 'long value = optLong.orElse(0L);', 'double value = optDouble.orElse(0.0);', 'No boxing for primitives']} />
      
      <JNote x={120} y={330}>Parallel = free scaling for CPU-bound large data. Primitive streams avoid boxing overhead.</JNote>
    </svg>
  );
}
