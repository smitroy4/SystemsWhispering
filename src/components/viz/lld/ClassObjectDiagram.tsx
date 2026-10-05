import { LArrow, LBox, LCheck, LNote } from './lldPrimitives.tsx';

/** One Product blueprint, two independent objects, this naming the receiver. */
export default function ClassObjectDiagram() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Class blueprint with two independent objects">
      <LBox x={200} y={20} w={160} title="class Product" rows={['id, price', 'changePrice()']} tone="iface" />
      <LArrow x1={240} y1={110} x2={130} y2={150} label="new" />
      <LArrow x1={320} y1={110} x2={430} y2={150} label="new" />
      <LBox x={30} y={150} w={200} title="phone: Product" rows={['P-101', 'price = 900']} />
      <LBox x={330} y={150} w={200} title="laptop: Product" rows={['P-102', 'price = 8999']} />
      <LCheck x={262} y={238} />
      <LNote x={280} y={242}>Same class, independent state — this names the receiver.</LNote>
    </svg>
  );
}
