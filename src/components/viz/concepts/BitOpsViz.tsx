import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from '../algo/StatePanel.tsx';
import type { StateEntry } from '../algo/StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';
import './concepts.css';

interface BitRows {
  rows: Array<{ label: string; bits: number[]; tones: CellTone[] }>;
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';

function toBits(n: number): number[] {
  return Array.from({ length: 8 }, (_, k) => (n >> (7 - k)) & 1);
}

function frame(
  id: string,
  description: string,
  rows: Array<{ label: string; bits: number[]; tones: CellTone[] }>,
  panel: StateEntry[],
): VizStep {
  return { id, description, state: { rows, panel } satisfies BitRows, highlight: [] };
}

const ALL_D = toBits(0).map(() => D);

/** a = 12, b = 10: AND, OR, XOR, shifts, and the lowest-set-bit trick. */
function buildSteps(): VizStep[] {
  const a = 12; // 00001100
  const b = 10; // 00001010
  const abit = toBits(a);
  const bbit = toBits(b);
  const hot = (bits: number[]): CellTone[] => bits.map((v) => (v === 1 ? A : D));

  return [
    frame('and', `AND keeps only positions where BOTH have 1: 12 & 10 = ${a & b}. Masks test and clear bits.`, [
      { label: 'a = 12', bits: abit, tones: [...ALL_D] },
      { label: 'b = 10', bits: bbit, tones: [...ALL_D] },
      { label: `a & b = ${a & b}`, bits: toBits(a & b), tones: hot(toBits(a & b)) },
    ], [
      { label: 'op', value: '12 & 10' },
      { label: 'result', value: String(a & b) },
    ]),
    frame('or', `OR keeps positions where EITHER has 1: 12 | 10 = ${a | b}. Masks set bits.`, [
      { label: 'a = 12', bits: abit, tones: [...ALL_D] },
      { label: 'b = 10', bits: bbit, tones: [...ALL_D] },
      { label: `a | b = ${a | b}`, bits: toBits(a | b), tones: hot(toBits(a | b)) },
    ], [
      { label: 'op', value: '12 | 10' },
      { label: 'result', value: String(a | b) },
    ]),
    frame('xor', `XOR keeps positions where bits DIFFER: 12 ^ 10 = ${a ^ b}. The toggle and difference operator.`, [
      { label: 'a = 12', bits: abit, tones: [...ALL_D] },
      { label: 'b = 10', bits: bbit, tones: [...ALL_D] },
      { label: `a ^ b = ${a ^ b}`, bits: toBits(a ^ b), tones: hot(toBits(a ^ b)) },
    ], [
      { label: 'op', value: '12 ^ 10' },
      { label: 'result', value: String(a ^ b) },
    ]),
    frame('shl', `Left shift multiplies by 2 per step: 12 << 2 = ${a << 2}. Bits fall off the left, zeros enter right.`, [
      { label: 'a = 12', bits: abit, tones: [...ALL_D] },
      { label: `a << 2 = ${a << 2}`, bits: toBits(a << 2), tones: hot(toBits(a << 2)) },
    ], [
      { label: 'op', value: '12 << 2' },
      { label: 'result', value: String(a << 2) },
    ]),
    frame('shr', `Signed right shift divides by 2, sign-extended: 12 >> 2 = ${a >> 2}. Unsigned >>> fills zeros instead.`, [
      { label: 'a = 12', bits: abit, tones: [...ALL_D] },
      { label: `a >> 2 = ${a >> 2}`, bits: toBits(a >> 2), tones: hot(toBits(a >> 2)) },
    ], [
      { label: 'op', value: '12 >> 2' },
      { label: 'result', value: String(a >> 2) },
    ]),
    frame('lowbit', `x & (x − 1) clears the lowest set bit: 12 & 11 = ${a & (a - 1)}. Repeating counts set bits in O(popcount).`, [
      { label: 'x = 12', bits: abit, tones: [...ALL_D] },
      { label: 'x − 1 = 11', bits: toBits(a - 1), tones: [...ALL_D] },
      { label: `x & (x−1) = ${a & (a - 1)}`, bits: toBits(a & (a - 1)), tones: hot(toBits(a & (a - 1))) },
    ], [
      { label: 'op', value: '12 & 11' },
      { label: 'result', value: String(a & (a - 1)) },
    ]),
    frame('done', 'Done: AND/OR/XOR combine bits, shifts scale by powers of two, x & (x−1) peels the lowest 1.', [
      { label: 'a = 12', bits: abit, tones: hot(abit) },
      { label: 'b = 10', bits: bbit, tones: hot(bbit) },
    ], [
      { label: 'cheatsheet', value: '& test · | set · ^ toggle · << ×2 · >> ÷2' },
    ]),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BitRows;
  return (
    <div className="algo-scene">
      <div>
        {state.rows.map((row) => (
          <div key={row.label}>
            <p className="viz-array-label">{row.label}</p>
            <ArrayCells values={row.bits} tones={row.tones} pointers={[]} />
          </div>
        ))}
      </div>
      <StatePanel title="Operation" entries={state.panel} />
    </div>
  );
}

export default function BitOpsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Default', hint: 'Bit 0' },
          { tone: 'active', label: 'Active', hint: 'Bit 1 / result bits' },
          { tone: 'compared', label: 'Compared', hint: 'Unused here' },
          { tone: 'swapped', label: 'Swapped / Found', hint: 'Unused here' },
          { tone: 'done', label: 'Done', hint: 'Unused here' },
        ]}
      />
    </>
  );
}
