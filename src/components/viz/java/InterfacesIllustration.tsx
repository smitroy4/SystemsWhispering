import { JBox, JNote } from './javaPrimitives.tsx';

export default function InterfacesIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Interfaces: default, functional, marker">
      {/* default methods */}
      <JBox x={40} y={30} w={300} title="Default methods" rows={['interface Collection<E> {', '    void add(E e);', '', '    default boolean isEmpty() {', '        return size() == 0;', '    }', '}', 'Default = implement once in interface', 'Implementations inherit, can override']} />
      
      {/* functional interface */}
      <JBox x={380} y={30} w={280} title="Functional interface" rows={['@FunctionalInterface', 'interface Processor {', '    void process(String s);', '}', 'Processor p = s -> System.out.println(s);', 'Lambda implements the single abstract method']} tone="good" />
      
      {/* marker interface */}
      <JBox x={40} y={180} w={280} title="Marker interface" rows={['interface Serializable { }', 'interface Cloneable { }', 'interface RandomAccess { }', 'No methods — just a tag', 'JVM checks instanceof', 'e.g., Collections.sort uses RandomAccess']} tone="neutral" />
      
      <JNote x={120} y={330}>Default methods evolve interfaces. Functional = 1 abstract method (lambda target). Marker = tag for JVM.</JNote>
    </svg>
  );
}
