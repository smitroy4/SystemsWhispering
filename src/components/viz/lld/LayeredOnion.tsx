import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Each layer decides what the others must not. */
export default function LayeredOnion() {
  const layers = ['Controller: HTTP', 'Service: orchestration', 'Domain: invariants', 'Repository: contract'];
  return (
    <svg className="viz-svg" viewBox="0 0 560 280" role="img" aria-label="Layered separation of concerns">
      {layers.map((title, i) => (
        <g key={title}>
          <LBox x={130} y={16 + i * 58} w={300} title={title} rows={[]} tone={i === 2 ? 'good' : 'default'} />
          {i < layers.length - 1 ? (
            <LArrow x1={280} y1={67 + i * 58} x2={280} y2={74 + i * 58} />
          ) : null}
        </g>
      ))}
      <LNote x={280} y={262}>SQL, providers, and email never live above their layer.</LNote>
    </svg>
  );
}
