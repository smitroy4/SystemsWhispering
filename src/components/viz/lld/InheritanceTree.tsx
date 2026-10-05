import { LArrow, LBox, LCross, LNote } from './lldPrimitives.tsx';

/** Valid hierarchies beside the has-a mistake. */
export default function InheritanceTree() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 250" role="img" aria-label="Inheritance shapes with an is-a failure">
      <LBox x={30} y={30} w={120} title="Animal" rows={[]} />
      <LArrow x1={90} y1={98} x2={90} y2={118} />
      <LBox x={30} y={118} w={120} title="Mammal" rows={[]} />
      <LArrow x1={90} y1={186} x2={90} y2={206} />
      <LBox x={30} y={206} w={120} title="Dog" rows={[]} />
      <LBox x={230} y={30} w={120} title="Vehicle" rows={[]} />
      <LArrow x1={290} y1={98} x2={290} y2={118} />
      <LBox x={230} y={118} w={120} title="Car" rows={[]} />
      <LBox x={410} y={30} w={120} title="Car" rows={[]} />
      <LArrow x1={470} y1={98} x2={470} y2={118} />
      <LBox x={410} y={118} w={120} title="Engine" rows={[]} tone="bad" />
      <LCross x={470} y={205} />
      <LNote x={280} y={242}>A car has an engine — never an is-a.</LNote>
    </svg>
  );
}
