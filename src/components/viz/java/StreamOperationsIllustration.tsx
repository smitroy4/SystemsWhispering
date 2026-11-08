import { JBox, JNote } from './javaPrimitives.tsx';

export default function StreamOperationsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Stream intermediate and terminal operations">
      <JBox x={40} y={30} w={300} title="Intermediate (lazy)" rows={['filter(Predicate)', 'map(Function)', 'flatMap(Function)', 'distinct()', 'sorted() / sorted(Comparator)', 'peek(Consumer)  // debugging', 'limit(n), skip(n)', 'takeWhile/while (Java 9+)', '', 'Stateless: filter, map, flatMap', 'Stateful: distinct, sorted, limit, skip']} />
      
      <JBox x={380} y={30} w={280} title="Terminal (eager)" rows={['forEach(Consumer)', 'forEachOrdered(Consumer)', 'toArray() / toArray(IntFunction)', 'reduce(BinaryOperator)', 'collect(Collector)', 'min/max(Comparator)', 'count()', 'anyMatch/allMatch/noneMatch', 'findFirst/findAny', 'iterator() / spliterator()']} tone="good" />
      
      <JBox x={40} y={180} w={300} title="Collectors" rows={['toList(), toSet(), toCollection()', 'toMap(keyMapper, valueMapper)', '  toMap(k, v, mergeFn, mapFactory)', 'groupingBy(classifier)', '  groupingBy(c, downstream)', 'partitioningBy(predicate)', 'joining(delimiter)', 'summarizingInt(mapper)', 'reducing(identity, accumulator, combiner)']} />
      
      <JNote x={120} y={330}>Intermediate ops return stream (lazy). Terminal ops produce result/side-effect (eager). Short-circuit ops stop early.</JNote>
    </svg>
  );
}
