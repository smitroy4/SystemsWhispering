import { LArrow, LBox, LCross, LNote } from './lldPrimitives.tsx';

/** Private state behind a wall; behavior methods are the only gate. */
export default function EncapsulationWall() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 250" role="img" aria-label="Encapsulated account with guarded operations">
      <LBox x={200} y={40} w={170} title="BankAccount" rows={['− balance (private)', '+ withdraw()', '+ balance()']} tone="good" />
      <LBox x={30} y={150} w={150} title="caller" rows={['account.withdraw(400)']} />
      <LBox x={390} y={150} w={140} title="attacker" rows={['balance = −1']} tone="bad" />
      <LArrow x1={150} y1={165} x2={235} y2={120} active label="allowed" />
      <LArrow x1={420} y1={150} x2={350} y2={110} label="blocked" />
      <LCross x={383} y={130} />
      <LNote x={280} y={232}>Behavior guards transitions — raw fields admit anything.</LNote>
    </svg>
  );
}
