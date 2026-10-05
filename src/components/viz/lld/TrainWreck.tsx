import { LBox, LCross, LCheck, LNote } from './lldPrimitives.tsx';

/** Four-link spelunking beside one delegated question. */
export default function TrainWreck() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Train wreck chain versus delegation">
      <LNote x={280} y={20}>order.getCustomer().getAddress().getCity().getName()</LNote>
      {['Order', 'Customer', 'Address', 'City'].map((t, i) => (
        <LBox key={t} x={15 + i * 137} y={40} w={125} title={t} rows={[]} tone="bad" />
      ))}
      <LCross x={280} y={140} />
      <LBox x={170} y={158} w={220} title="order.shippingCityName()" rows={['one hop, owned inside']} tone="good" />
      <LCheck x={405} y={185} />
    </svg>
  );
}
