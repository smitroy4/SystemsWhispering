import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Plain link, hollow diamond, filled diamond — with lifetime notes. */
export default function OwnershipDiamonds() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 270" role="img" aria-label="Association, aggregation, composition">
      <LBox x={30} y={30} w={130} title="Doctor" rows={[]} />
      <LArrow x1={160} y1={52} x2={220} y2={52} />
      <LBox x={220} y={30} w={130} title="Patient" rows={[]} />
      <LNote x={440} y={56}>association: interacts</LNote>
      <LBox x={30} y={110} w={130} title="Team ◇" rows={[]} />
      <LArrow x1={160} y1={132} x2={220} y2={132} />
      <LBox x={220} y={110} w={130} title="Player" rows={[]} />
      <LNote x={440} y={136}>aggregation: survives the team</LNote>
      <LBox x={30} y={190} w={130} title="Order ◆" rows={[]} tone="good" />
      <LArrow x1={160} y1={212} x2={220} y2={212} active />
      <LBox x={220} y={190} w={130} title="OrderItem" rows={[]} tone="good" />
      <LNote x={440} y={216}>composition: dies with it</LNote>
    </svg>
  );
}
