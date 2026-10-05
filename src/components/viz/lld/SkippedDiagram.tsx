import { LNote } from './lldPrimitives.tsx';

/** Placeholder for diagram ids without an illustration yet. */
export default function SkippedDiagram() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 120" role="img" aria-label="Illustration coming soon">
      <LNote x={280} y={64}>Illustration coming soon — the concept above carries the idea.</LNote>
    </svg>
  );
}
