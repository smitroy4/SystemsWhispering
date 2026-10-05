import { LArrow, LBox, LCross, LNote } from './lldPrimitives.tsx';

/** Concrete dependency versus inverted contract. */
export default function DependencyInversion() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 270" role="img" aria-label="Dependency direction before and after inversion">
      <LNote x={140} y={20}>before: policy knows the SDK</LNote>
      <LBox x={50} y={34} w={180} title="OrderService" rows={[]} tone="bad" />
      <LArrow x1={140} y1={102} x2={140} y2={126} />
      <LBox x={50} y={126} w={180} title="StripeSdkClient" rows={[]} tone="bad" />
      <LCross x={245} y={130} />
      <LNote x={420} y={20}>after: both meet at the contract</LNote>
      <LBox x={330} y={34} w={180} title="OrderService" rows={[]} tone="good" />
      <LArrow x1={420} y1={102} x2={420} y2={126} active label="depends on" />
      <LBox x={330} y={126} w={180} title="PaymentProcessor" rows={['(abstraction)']} tone="iface" />
      <LArrow x1={470} y1={194} x2={470} y2={212} dashed />
      <LBox x={360} y={212} w={120} title="Stripe impl" rows={[]} />
      <LNote x={280} y={258}>Arrows point at stability, never at vendors.</LNote>
    </svg>
  );
}
