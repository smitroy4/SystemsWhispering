import { JBox, JNote } from './javaPrimitives.tsx';

export default function OptionalIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Optional usage patterns">
      <JBox x={40} y={30} w={300} title="Creation" rows={['Optional.empty()', 'Optional.of(value)      // non-null', 'Optional.ofNullable(value) // may be null', '', 'Optional<String> opt =', '    Optional.ofNullable(getName());']} />
      
      <JBox x={380} y={30} w={280} title="Transformation" rows={['opt.map(x -> x.length())', '    // Optional<Integer>', 'opt.flatMap(x -> find(x))', '    // Optional<Result>', 'opt.filter(x -> x > 5)', '    // filters, may become empty']} tone="good" />
      
      <JBox x={40} y={180} w={280} title="Consumption" rows={['opt.ifPresent(x -> System.out.println(x))', 'opt.ifPresentOrElse(', '    x -> use(x),', '    () -> handleMissing()', ')', '', 'orElse(default)', 'orElseGet(() -> default)', 'orElseThrow(() -> new NoSuchElementException())']} tone="good" />
      
      <JBox x={380} y={180} w={280} title="Anti-patterns" rows={['❌ opt.get()  // throws if empty', '❌ opt.isPresent() then opt.get()', '✅ opt.ifPresent(...)', '✅ opt.orElse(default)', '✅ opt.orElseThrow(...)']} tone="bad" />
      
      <JNote x={120} y={330}>Optional = container for 0 or 1 value. Never call get() unconditionally. Use ifPresent/orElse/orElseThrow.</JNote>
    </svg>
  );
}
