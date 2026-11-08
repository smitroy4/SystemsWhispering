import { JBox, JNote } from './javaPrimitives.tsx';

export default function ConcurrencyProblemsIllustration() {
  return (
    <svg className="viz-svg" viewBox="0 0 700 360" role="img" aria-label="Race conditions, visibility, ordering">
      <JBox x={40} y={30} w={280} title="Race condition" rows={['int counter = 0;', '// Thread A: counter++', '// Thread B: counter++', '// Expected: 2', '// Actual: often 1', 'Reason: read-modify-write not atomic']} tone="bad" />
      
      <JBox x={380} y={30} w={280} title="Visibility" rows={['Thread A: flag = true', 'Thread B: while (!flag) { }', '// B may never see change!', 'Reason: no happens-before', 'Fix: volatile or synchronized']} tone="bad" />
      
      <JBox x={40} y={180} w={280} title="Reordering" rows={['Thread A:', '  x = 1;', '  ready = true;', '', 'Thread B:', '  if (ready) print(x);', '// May print 0!', 'Reason: compiler/CPU reorder', 'Fix: volatile or synchronized']} tone="bad" />
      
      <JNote x={120} y={330}>Race = atomicity. Visibility = cache/coherence. Reordering = compiler/CPU optimization. volatile fixes visibility + reordering.</JNote>
    </svg>
  );
}
