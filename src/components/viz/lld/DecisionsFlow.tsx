import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Requirements flow down into runtime behavior. */
export default function DecisionsFlow() {
  const stages = ['Requirements', 'Decisions', 'Structure', 'Code', 'Runtime'];
  return (
    <svg className="viz-svg" viewBox="0 0 560 300" role="img" aria-label="Design decision flow">
      {stages.map((title, i) => (
        <g key={title}>
          <LBox x={190} y={14 + i * 52} w={180} title={title} rows={[]} tone={i === 1 ? 'good' : 'default'} />
          {i < stages.length - 1 ? (
            <LArrow x1={280} y1={65 + i * 52} x2={280} y2={66 + i * 52} active={i === 0} />
          ) : null}
        </g>
      ))}
      <LNote x={280} y={288}>Code is where decisions become concrete.</LNote>
    </svg>
  );
}
