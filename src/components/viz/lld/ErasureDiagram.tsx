import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Two generic spellings, one runtime class. */
export default function ErasureDiagram() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 230" role="img" aria-label="Type erasure merging generic lists">
      <LBox x={30} y={40} w={150} title="List<String>" rows={['compile-time']} />
      <LBox x={30} y={140} w={150} title="List<Integer>" rows={['compile-time']} />
      <LArrow x1={180} y1={75} x2={300} y2={100} label="erase" />
      <LArrow x1={180} y1={175} x2={300} y2={130} label="erase" />
      <LBox x={300} y={80} w={170} title="List (raw)" rows={['one runtime class']} tone="good" />
      <LNote x={280} y={210}>`new T()` is impossible — the runtime never knew T.</LNote>
    </svg>
  );
}
