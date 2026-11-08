import { JBox, JNote } from './javaPrimitives.tsx';

export default function ComparableComparatorIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Comparable and Comparator">
      <JBox x={40} y={30} w={280} title="Comparable (natural order)" rows={['interface Comparable<T> {', '    int compareTo(T other);', '}', 'class Person implements Comparable<Person> {', '    String name;', '    int compareTo(Person o) {', '        return this.name.compareTo(o.name);', '    }', '}', 'Collections.sort(list) // uses compareTo']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="Comparator (external order)" rows={['Comparator<Person> byAge =', '    (a, b) -> a.age - b.age;', '', 'Comparator<Person> byNameDesc =', '    Comparator.comparing(Person::getName)', '    .reversed();', '', 'Collections.sort(list, byAge);', 'list.sort(byNameDesc);']} tone="good" />
      
      <JNote x={120} y={330}>Comparable = natural ordering (built-in). Comparator = flexible, multiple orderings. Use Comparator.comparing for chains.</JNote>
    </svg>
  );
}
