import { LArrow, LBox, LNote } from './lldPrimitives.tsx';

/** Stack frames hold references; the BankAccount object lives on the heap. */
export default function StackHeapDiagram() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 250" role="img" aria-label="Stack frames referencing a heap object">
      <LNote x={110} y={20}>Thread stack</LNote>
      <LNote x={410} y={20}>Heap</LNote>
      <LBox x={30} y={34} w={160} title="main()" rows={['account ──────┐']} />
      <LBox x={30} y={120} w={160} title="deposit()" rows={['amount = 500']} />
      <LArrow x1={150} y1={60} x2={330} y2={120} active label="reference" />
      <LBox x={330} y={88} w={170} title="BankAccount" rows={['ACC-1', 'balance = 5000']} tone="good" />
      <LNote x={280} y={228}>Frames hold execution state — objects live on the heap.</LNote>
    </svg>
  );
}
