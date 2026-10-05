import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Deep chain that ripples versus flat collaborators. */
export default function FragileBase() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 280" role="img" aria-label="Fragile base class versus composition">
      <LNote x={130} y={20}>deep chain: edits ripple</LNote>
      <LBox x={55} y={34} w={150} title="Base" rows={[]} tone="bad" />
      <LArrow x1={130} y1={102} x2={130} y2={120} />
      <LBox x={55} y={120} w={150} title="A" rows={[]} />
      <LArrow x1={130} y1={188} x2={130} y2={206} />
      <LBox x={55} y={206} w={150} title="B" rows={[]} />
      <LNote x={400} y={20}>composed: swap parts freely</LNote>
      <LBox x={325} y={34} w={150} title="Delivery" rows={[]} tone="good" />
      <LArrow x1={360} y1={102} x2={360} y2={120} active />
      <LArrow x1={440} y1={102} x2={440} y2={120} active />
      <LBox x={300} y={120} w={120} title="Pricing" rows={[]} tone="good" />
      <LBox x={440} y={120} w={120} title="Routing" rows={[]} tone="good" />
      <LNote x={280} y={262}>Independent behaviors compose; they never inherit.</LNote>
    </svg>
  );
}
