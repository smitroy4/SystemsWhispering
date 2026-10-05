import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Capability contract versus shared base with state. */
export default function InterfaceVsAbstract() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 270" role="img" aria-label="Interface contract beside abstract base">
      <LNote x={140} y={20}>interface: capability only</LNote>
      <LBox x={40} y={34} w={200} title="«interface» Channel" rows={['send(msg)']} tone="iface" />
      <LArrow x1={90} y1={119} x2={90} y2={140} />
      <LArrow x1={190} y1={119} x2={190} y2={140} />
      <LBox x={20} y={140} w={110} title="Email" rows={[]} />
      <LBox x={150} y={140} w={110} title="Sms" rows={[]} />
      <LNote x={420} y={20}>abstract: contract + state</LNote>
      <LBox x={320} y={34} w={200} title="PaymentGateway" rows={['# merchantId', '+ validate()', '+ charge() *']} tone="iface" />
      <LArrow x1={420} y1={136} x2={420} y2={157} />
      <LBox x={350} y={157} w={140} title="StripeGateway" rows={[]} />
      <LNote x={280} y={250}>Unrelated implementers → interface. Shared state → abstract base.</LNote>
    </svg>
  );
}
