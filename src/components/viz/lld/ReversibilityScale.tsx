import { LBox, LNote } from './lldPrimitives.tsx';

/** Cheap-to-reverse beside expensive-to-reverse on one scale. */
export default function ReversibilityScale() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 200" role="img" aria-label="Reversibility scale">
      <line x1={40} y1={110} x2={520} y2={110} stroke="var(--viz-muted-ink)" strokeWidth={2} />
      <polygon points="520,104 534,110 520,116" fill="var(--viz-muted-ink)" />
      <LBox x={40} y={40} w={170} title="rename method" rows={['cheap']} tone="good" />
      <LBox x={350} y={40} w={170} title="service boundary" rows={['expensive']} tone="bad" />
      <LNote x={280} y={160}>Spend design effort proportional to reversal cost.</LNote>
    </svg>
  );
}
