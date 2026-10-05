import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Services and topology beside classes and collaborations. */
export default function HldLldLayers() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 270" role="img" aria-label="HLD versus LLD scope">
      <LNote x={140} y={20}>HLD: services</LNote>
      <LBox x={40} y={34} w={200} title="Order Service" rows={['Payment Service', 'Inventory Service']} />
      <LNote x={420} y={20}>LLD: classes</LNote>
      <LBox x={320} y={34} w={200} title="OrderService" rows={['OrderRepository', 'PaymentProcessor']} tone="good" />
      <LArrow x1={140} y1={140} x2={140} y2={160} label="constrains" dashed />
      <LArrow x1={420} y1={140} x2={420} y2={160} label="informs" dashed />
      <LBox x={40} y={160} w={200} title="statelessness" rows={['no local sessions']} />
      <LBox x={320} y={160} w={200} title="no static cache" rows={['passes state along']} tone="good" />
      <LNote x={280} y={252}>The level depends on the boundary you are designing.</LNote>
    </svg>
  );
}
