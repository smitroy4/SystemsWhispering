import { JBox, JNote } from './javaPrimitives.tsx';

export default function WildcardsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Wildcards: ?, extends, super">
      <JBox x={40} y={30} w={280} title="Unbounded ?" rows={['List<?> list = new ArrayList<String>();', 'list.add(null); // only null allowed', 'Object o = list.get(0); // read as Object', 'Use when: reading only, no specific type needed']} />
      
      <JBox x={380} y={30} w={280} title="? extends T (producer)" rows={['List<? extends Number> nums =', '    new ArrayList<Integer>();', 'Number n = nums.get(0); // read', '// nums.add(42); // ERROR! cannot add', 'PECS: Producer Extends']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="? super T (consumer)" rows={['List<? super Integer> ints =', '    new ArrayList<Number>();', 'ints.add(42); // write OK', 'ints.add(new Integer(10)); // OK', 'Object o = ints.get(0); // read as Object', 'PECS: Consumer Super']} tone="good" />
      
      <JNote x={120} y={330}>PECS: Producer Extends (read), Consumer Super (write). ? = read Object, write nothing.</JNote>
    </svg>
  );
}
