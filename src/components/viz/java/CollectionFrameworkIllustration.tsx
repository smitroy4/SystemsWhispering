import { JBox, JArrow, JNote } from './javaPrimitives.tsx';

export default function CollectionFrameworkIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Java Collections Framework hierarchy">
      <JBox x={40} y={30} w={280} title="Iterable" rows={['iterator()', 'forEach()', 'spliterator()']} />
      <JArrow x1={180} y1={70} x2={180} y2={90} label="" />
      <JBox x={40} y={90} w={280} title="Collection" rows={['add, remove, contains', 'size, isEmpty', 'toArray, clear', 'stream()']} />
      <JArrow x1={180} y1={150} x2={180} y2={170} label="" />
      <JBox x={40} y={170} w={280} title="List" rows={['get, set, add(index)', 'indexOf, lastIndexOf', 'subList, listIterator']} tone="good" />
      <JBox x={40} y={250} w={280} title="Set" rows={['no duplicates', 'equals/hashCode based']} />
      <JBox x={40} y={210} w={280} title="Queue/Deque" rows={['offer, poll, peek', 'addFirst, addLast']} tone="neutral" />
      
      <JBox x={380} y={30} w={280} title="Map" rows={['put, get, remove', 'keySet, values, entrySet', 'computeIfAbsent, merge', 'forEach']} />
      
      <JNote x={120} y={330}>Collection hierarchy: Iterable → Collection → List/Set/Queue. Map separate. Choose by access pattern.</JNote>
    </svg>
  );
}
