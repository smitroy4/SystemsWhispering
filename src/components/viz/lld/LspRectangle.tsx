import { LArrow, LBox, LCheck, LCross, LNote } from './lldPrimitives.tsx';

/** Broken promise beside the honest capability split. */
export default function LspRectangle() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Liskov violation fixed by capability split">
      <LNote x={140} y={20}>violates: throws for fly()</LNote>
      <LBox x={60} y={34} w={160} title="Bird" rows={['fly()']} tone="bad" />
      <LArrow x1={140} y1={102} x2={140} y2={124} />
      <LBox x={60} y={124} w={160} title="Penguin" rows={['throws!']} tone="bad" />
      <LCross x={245} y={120} />
      <LNote x={420} y={20}>honest: promises kept</LNote>
      <LBox x={330} y={34} w={180} title="Bird" rows={['eat()']} tone="good" />
      <LArrow x1={420} y1={102} x2={420} y2={124} active />
      <LBox x={330} y={124} w={180} title="FlyingBird" rows={['eat() + fly()']} tone="iface" />
      <LArrow x1={370} y1={192} x2={340} y2={208} />
      <LArrow x1={470} y1={192} x2={500} y2={208} />
      <LBox x={280} y={208} w={110} title="Sparrow" rows={[]} tone="good" />
      <LBox x={400} y={208} w={110} title="Penguin" rows={['eats']} tone="good" />
      <LCheck x={245} y={160} />
    </svg>
  );
}
