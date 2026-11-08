import { JBox, JNote } from './javaPrimitives.tsx';

export default function SpecializedMapsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Specialized maps: EnumMap, IdentityHashMap, WeakHashMap, LinkedHashMap">
      <JBox x={40} y={30} w={280} title="EnumMap" rows={['Key: enum type only', 'Backed by array (ordinal)', 'Extremely fast & compact', 'EnumMap<Day, String> m =', '    new EnumMap<>(Day.class);', 'm.put(Day.MONDAY, "Mon");']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="IdentityHashMap" rows={['Key: identity (==) not equals()', 'System.identityHashCode()', 'Mutable keys OK', 'Slower than HashMap', 'Use: object graph traversal, serialization']} tone="neutral" />
      
      <JBox x={40} y={180} w={280} title="WeakHashMap" rows={['Key: weak reference', 'Entry removed when key GC\'d', 'Use: caches, listeners', 'Values NOT weak!', 'Key → value prevents GC of key']} tone="neutral" />
      
      <JBox x={380} y={180} w={280} title="LinkedHashMap" rows={['Insertion-order (default)', 'Access-order: new LinkedHashMap<>(16, .75f, true)', 'LRU cache: override removeEldestEntry', 'Iteration order = insertion/access']} tone="good" />
      
      <JNote x={120} y={330}>EnumMap fastest for enums. LinkedHashMap for order. WeakHashMap for caches. IdentityHashMap for identity semantics.</JNote>
    </svg>
  );
}
