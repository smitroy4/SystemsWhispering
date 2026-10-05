import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Provider swap: leaked details detonate; adapters contain it. */
export default function BlastRadius() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Blast radius before and after an adapter">
      <LNote x={140} y={20}>leaked: 6 files move</LNote>
      {['Ctrl', 'Svc', 'Order'].map((t, i) => (
        <LBox key={t} x={30 + i * 100} y={34} w={92} title={t} rows={[]} tone="bad" />
      ))}
      {['DB', 'Mail', 'Tests'].map((t, i) => (
        <LBox key={t} x={30 + i * 100} y={120} w={92} title={t} rows={[]} tone="bad" />
      ))}
      <LNote x={420} y={20}>adapted: 1 file moves</LNote>
      <LBox x={350} y={34} w={140} title="CheckoutService" rows={['untouched']} />
      <LArrow x1={420} y1={102} x2={420} y2={124} active />
      <LBox x={350} y={124} w={140} title="StripeAdapter" rows={['swapped']} tone="good" />
      <LNote x={280} y={244}>Small blast radius is the observable score.</LNote>
    </svg>
  );
}
