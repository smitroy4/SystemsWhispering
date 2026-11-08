import { JBox, JNote } from './javaPrimitives.tsx';

export default function GenericsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Generics and bounded types">
      <JBox x={40} y={30} w={300} title="Generic class" rows={['class Box<T> {', '    private T value;', '    void set(T v) { value = v; }', '    T get() { return value; }', '}', 'Box<String> bs = new Box<>();', 'bs.set("hello");', 'String s = bs.get();  // type-safe']} />
      
      <JBox x={380} y={30} w={280} title="Bounded type parameters" rows={['class NumberBox<T extends Number> {', '    T value;', '    double doubleValue() {', '        return value.doubleValue();', '    }', '}', 'NumberBox<Integer> ok;', 'NumberBox<String> error; // String not Number']} tone="good" />
      
      <JNote x={120} y={330}>Generics provide compile-time type safety. Bounds restrict to specific hierarchies. Erasure at runtime.</JNote>
    </svg>
  );
}
