import { JBox, JNote } from './javaPrimitives.tsx';

export default function MethodReferencesIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Method references and composition">
      <JBox x={40} y={30} w={300} title="Method reference forms" rows={['Static: ClassName::staticMethod', 'Instance (bound): obj::instanceMethod', 'Instance (unbound): ClassName::instanceMethod', 'Constructor: ClassName::new', 'Array constructor: Type[]::new']} />
      
      <JBox x={380} y={30} w={280} title="Function composition" rows={['Function<Integer, Integer> f = x -> x * 2;', 'Function<Integer, Integer> g = x -> x + 1;', '', '// f then g: (x*2)+1', 'Function<Integer, Integer> fg = f.andThen(g);', '// g then f: 2*(x+1)', 'Function<Integer, Integer> gf = g.andThen(f);', '', '// f before g', 'Function<Integer, Integer> cf = f.compose(g);']} />
      
      <JNote x={120} y={330}>Method ref = shorthand for lambda calling single method. andThen = left-to-right, compose = right-to-left.</JNote>
    </svg>
  );
}
