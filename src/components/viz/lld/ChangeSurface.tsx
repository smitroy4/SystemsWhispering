import { LArrow, LBox, LCross, LCheck, LNote } from './lldPrimitives.tsx';

/** Same new requirement, two change surfaces. */
export default function ChangeSurface() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Change blast radius comparison">
      <LNote x={140} y={20}>Design A: 8 classes move</LNote>
      {['Ctrl', 'Svc', 'Order', 'DB', 'Mail', 'Tests'].map((t, i) => (
        <LBox key={t} x={30 + (i % 3) * 100} y={34 + Math.floor(i / 3) * 70} w={92} title={t} rows={[]} tone="bad" />
      ))}
      <LCross x={330} y={120} />
      <LNote x={450} y={20}>Design B: 1 class added</LNote>
      <LBox x={380} y={34} w={140} title="stable core" rows={['untouched']} />
      <LArrow x1={450} y1={102} x2={450} y2={124} active label="+ WhatsApp" />
      <LBox x={380} y={124} w={140} title="WhatsAppSender" rows={['new']} tone="good" />
      <LCheck x={330} y={160} />
      <LNote x={280} y={244}>Judge designs by the next reasonable change.</LNote>
    </svg>
  );
}
