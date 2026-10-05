import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Stable service, varying policies, one dashed newcomer. */
export default function OcpPlugin() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Extension point with pluggable policies">
      <LBox x={200} y={30} w={160} title="DiscountService" rows={['stable core']} />
      <LArrow x1={280} y1={98} x2={280} y2={120} active label="uses" />
      <LBox x={180} y={120} w={200} title="DiscountPolicy" rows={['calculate()']} tone="iface" />
      <LArrow x1={230} y1={188} x2={180} y2={206} />
      <LArrow x1={330} y1={188} x2={380} y2={206} />
      <LArrow x1={280} y1={188} x2={280} y2={200} dashed />
      <LBox x={60} y={206} w={120} title="Regular" rows={[]} />
      <LBox x={220} y={206} w={120} title="Festival" rows={[]} tone="good" />
      <LBox x={380} y={206} w={120} title="Student *" rows={['new']} tone="good" />
      <LNote x={280} y={250}>New policy = new class. The core never reopens.</LNote>
    </svg>
  );
}
