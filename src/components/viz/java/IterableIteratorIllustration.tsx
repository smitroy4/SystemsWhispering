import { JBox, JNote } from './javaPrimitives.tsx';

export default function IterableIteratorIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Iterable, Iterator, fail-fast">
      <JBox x={40} y={30} w={280} title="Iterable" rows={['interface Iterable<T> {', '    Iterator<T> iterator();', '    default void forEach(Consumer)', '    default Spliterator<T> spliterator()', '}', 'Implemented by all Collections']} />
      
      <JBox x={380} y={30} w={280} title="Iterator" rows={['interface Iterator<E> {', '    boolean hasNext();', '    E next();', '    default void remove() {', '        throw new UnsupportedOperationException();', '    }', '}', 'Fail-fast: throws CME on concurrent mod']} tone="bad" />
      
      <JBox x={40} y={180} w={280} title="Fail-fast vs Fail-safe" rows={['Fail-fast (ArrayList, HashMap):', '  - Detects concurrent modification', '  - Throws ConcurrentModificationException', '  - Uses modCount internally', '', 'Fail-safe (CopyOnWriteArrayList, CHM):', '  - Iterates over snapshot/copy', '  - No exception', '  - Higher memory/CPU']} tone="bad" />
      
      <JNote x={120} y={330}>Iterator provides sequential access. Fail-fast = fail fast to prevent corruption. Fail-safe = copy/snapshot, no exception.</JNote>
    </svg>
  );
}
