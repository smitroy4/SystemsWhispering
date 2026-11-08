import { JBox, JNote } from './javaPrimitives.tsx';

export default function CollectionInterfaceIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Collection interface core methods">
      <JBox x={40} y={30} w={300} title="Core methods" rows={['boolean add(E e)', 'boolean remove(Object o)', 'boolean contains(Object o)', 'int size()', 'boolean isEmpty()', 'Iterator<E> iterator()', 'Object[] toArray()', '<T> T[] toArray(T[] a)', 'void clear()', 'boolean addAll(Collection)', 'boolean removeAll(Collection)', 'boolean retainAll(Collection)', 'boolean containsAll(Collection)']} />
      
      <JBox x={380} y={30} w={280} title="Default methods (Java 8+)" rows={['default boolean removeIf(Predicate)', 'default Stream<E> stream()', 'default Stream<E> parallelStream()', 'default void forEach(Consumer)', 'default boolean removeIf(Predicate)', 'default Spliterator<E> spliterator()']} />
      
      <JNote x={120} y={330}>Collection is the root of the collection hierarchy. All operations defined in terms of iterator.</JNote>
    </svg>
  );
}
