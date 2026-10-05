import { LBox, LNote } from './lldPrimitives.tsx';

/** Three restraint lessons in one frame. */
export default function SimplicityTriptych() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 230" role="img" aria-label="DRY KISS YAGNI triptych">
      <LNote x={95} y={20}>DRY: one owner</LNote>
      <LBox x={20} y={34} w={150} title="Order" rows={['canCancel()']} tone="good" />
      <LNote x={280} y={20}>KISS: one method</LNote>
      <LBox x={205} y={34} w={150} title="charge()" rows={['distance × rate']} tone="good" />
      <LNote x={465} y={20}>YAGNI: one DB</LNote>
      <LBox x={390} y={34} w={150} title="Postgres" rows={['today’s need']} tone="good" />
      <LNote x={280} y={150}>Knowledge once. Machinery minimal. Futures unbought.</LNote>
      <LBox x={120} y={164} w={320} title="Mongo? Cassandra? Dynamo?" rows={['speculation — not today']} tone="bad" />
    </svg>
  );
}
