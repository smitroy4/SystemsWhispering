import { JBox, JNote } from './javaPrimitives.tsx';

export default function StreamsCreationIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Stream creation methods">
      <JBox x={40} y={30} w={300} title="From collections" rows={['list.stream()', 'list.parallelStream()', 'set.stream()', 'map.values().stream()', 'map.entrySet().stream()']} />
      
      <JBox x={380} y={30} w={280} title="From arrays" rows={['Arrays.stream(array)', 'Arrays.stream(array, from, to)', 'Stream.of(e1, e2, e3)', 'Stream.ofNullable(obj)']} />
      
      <JBox x={40} y={180} w={280} title="From static factories" rows={['Stream.iterate(seed, f)', '  Stream.iterate(0, n -> n + 2)', '  // 0, 2, 4, 6...', '', 'Stream.generate(s)', '  Stream.generate(Math::random)', '  // infinite random']} />
      
      <JBox x={380} y={180} w={280} title="Numeric streams" rows={['IntStream.range(0, 10)', '  // 0..9', 'IntStream.rangeClosed(1, 10)', '  // 1..10', 'LongStream, DoubleStream', 'Chars: "abc".chars() → IntStream']} />
      
      <JNote x={120} y={330}>Streams are lazy. Creation doesn't process. Terminal op triggers pipeline.</JNote>
    </svg>
  );
}
