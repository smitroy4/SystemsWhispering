import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Sockets where fakes plug in: constructor, clock, and outcomes. */
export default function SeamDiagram() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 250" role="img" aria-label="Testability seams">
      <LBox x={180} y={30} w={200} title="PaymentService" rows={['pay()']} tone="good" />
      <LArrow x1={230} y1={98} x2={170} y2={130} active label="ctor seam" />
      <LArrow x1={330} y1={98} x2={390} y2={130} active label="clock seam" />
      <LBox x={40} y={130} w={180} title="FakeGateway" rows={['test double']} tone="good" />
      <LBox x={340} y={130} w={180} title="FixedClock" rows={['frozen time']} tone="good" />
      <LNote x={280} y={225}>If a fake cannot reach it, the boundary is wrong.</LNote>
    </svg>
  );
}
