import { JBox, JNote } from './javaPrimitives.tsx';

export default function StringsPoolIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="String pool and immutability">
      {/* string pool */}
      <JBox x={40} y={30} w={300} title="String pool" rows={['String a = "hello";  // literal → pool', 'String b = "hello";  // same ref from pool', 'a == b → true', '', 'String c = new String("hello"); // heap', 'c == a → false (different object)', 'c.equals(a) → true (same content)', '', 'c.intern() → returns pooled ref']} />
      
      {/* immutability */}
      <JBox x={380} y={30} w={280} title="Immutability" rows={['String s = "hello";', 's = s + " world";  // creates NEW object', 's.concat("!");     // returns new String', 'Original "hello" unchanged', '', 'Benefits:', '  - Thread-safe (shared freely)', '  - HashMap keys stable', '  - Security (paths, SQL)', '  - Pool sharing saves memory']} tone="good" />
      
      <JNote x={120} y={330}>String literals pooled. new String() bypasses pool. Use equals(), never == for content.</JNote>
    </svg>
  );
}
