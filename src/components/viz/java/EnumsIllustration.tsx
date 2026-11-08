import { JBox, JNote } from './javaPrimitives.tsx';

export default function EnumsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Java enums with fields, methods, EnumMap, EnumSet">
      <JBox x={40} y={30} w={300} title="Enum with fields & methods" rows={['enum Day {', '    MONDAY("Mon"), TUESDAY("Tue"),', '    WEDNESDAY("Wed"), THURSDAY("Thu"),', '    FRIDAY("Fri"), SATURDAY("Sat"),', '    SUNDAY("Sun");', '', '    private final String abbr;', '    Day(String abbr) { this.abbr = abbr; }', '    public String getAbbr() { return abbr; }', '}', 'Day.MONDAY.getAbbr() → "Mon"']} tone="good" />
      
      <JBox x={380} y={30} w={280} title="EnumMap & EnumSet" rows={['EnumMap<Day, String> schedule =', '    new EnumMap<>(Day.class);', 'schedule.put(Day.MONDAY, "Meeting");', '', 'EnumSet<Day> weekdays =', '    EnumSet.range(Day.MONDAY, Day.FRIDAY);', 'EnumSet<Day> weekend = EnumSet.of(', '    Day.SATURDAY, Day.SUNDAY);', 'Array-backed, bit-vector, extremely fast!']} />
      
      <JNote x={120} y={330}>Enums are type-safe singletons. EnumMap/EnumSet use bit vectors — zero overhead.</JNote>
    </svg>
  );
}
