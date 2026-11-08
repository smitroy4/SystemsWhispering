import { JBox, JNote } from './javaPrimitives.tsx';

export default function ObjectClassContractIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Object class contract: equals, hashCode, toString">
      {/* equals contract */}
      <JBox x={40} y={30} w={280} title="equals() contract" rows={['1. Reflexive: x.equals(x) = true', '2. Symmetric: x.equals(y) = y.equals(x)', '3. Transitive: x.equals(y) && y.equals(z) → x.equals(z)', '4. Consistent: repeated calls same result', '5. x.equals(null) = false', 'Violate → HashMap/HashSet broken!']} tone="bad" />
      
      {/* hashCode contract */}
      <JBox x={380} y={30} w={280} title="hashCode() contract" rows={['1. Equal objects → same hash', '2. Same object → same hash (lifetime)', '3. Unequal objects: may collide', '', 'equal objects MUST have equal hash', 'Unequal objects: can share hash', 'Collisions OK, but hurt performance']} tone="good" />
      
      {/* toString */}
      <JBox x={40} y={220} w={280} title="toString()" rows={['Override for debugging', 'class Person {', '    String name; int age;', '    @Override', '    public String toString() {', '        return \"Person[name=\"+name+\",age=\"+age+\"]\";', '    }', '}', 'Person["Alice",30]  // readable!']} />
      
      <JNote x={120} y={330}>equals + hashCode must be consistent. Always override both or neither. toString aids debugging.</JNote>
    </svg>
  );
}
