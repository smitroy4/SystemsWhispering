import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface LabeledArray {
  label: string;
  cells: Array<number | string>;
  tones: CellTone[];
}

interface StringState {
  arrays: LabeledArray[];
  pointers: CellPointer[];
}

function frame(id: string, description: string, state: StringState): VizStep {
  return { id, description, state, highlight: state.pointers.map((p) => p.index) };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** s += "c" then "d" (copy every time) vs StringBuilder appends (in place). */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: s = "ab" stored as [a, b]. Strings are immutable — watch what += does.', {
      arrays: [{ label: 's', cells: ['a', 'b'], tones: [D, D] }],
      pointers: [],
    }),
    frame('concat-c', 's += "c": allocate a NEW array [a, b, c] and copy both old chars. The old array is garbage.', {
      arrays: [
        { label: 'old s (garbage)', cells: ['a', 'b'], tones: [D, D] },
        { label: 'new s', cells: ['a', 'b', 'c'], tones: [D, D, S] },
      ],
      pointers: [],
    }),
    frame('concat-d', 's += "d": another new array, another full copy. n appends copy ~n²/2 chars.', {
      arrays: [
        { label: 'old s (garbage)', cells: ['a', 'b', 'c'], tones: [D, D, D] },
        { label: 'new s', cells: ['a', 'b', 'c', 'd'], tones: [D, D, D, S] },
      ],
      pointers: [],
    }),
    frame('builder-start', 'Better: a StringBuilder keeps a spare-capacity char buffer. Append "a", "b" — plain writes.', {
      arrays: [{ label: 'builder buffer (cap 4)', cells: ['a', 'b', '', ''], tones: [D, D, D, D] }],
      pointers: [{ label: 'size=2', index: 2 }],
    }),
    frame('builder-c', 'append("c"): one write into the spare slot. No copy, O(1).', {
      arrays: [{ label: 'builder buffer (cap 4)', cells: ['a', 'b', 'c', ''], tones: [D, D, S, D] }],
      pointers: [{ label: 'size=3', index: 3 }],
    }),
    frame('builder-d', 'append("d"): one more in-place write. The buffer is full now.', {
      arrays: [{ label: 'builder buffer (cap 4)', cells: ['a', 'b', 'c', 'd'], tones: [D, D, D, S] }],
      pointers: [{ label: 'size=4', index: 3 }],
    }),
    frame('tostring', 'toString(): a single copy into the final string. Total work for n appends: O(n).', {
      arrays: [
        { label: 'builder buffer', cells: ['a', 'b', 'c', 'd'], tones: [A, A, A, A] },
        { label: 'result', cells: ['a', 'b', 'c', 'd'], tones: [S, S, S, S] },
      ],
      pointers: [],
    }),
    frame('done', 'Done: += in a loop costs O(n²); StringBuilder costs O(n). Use builders (or String.join) for loops.', {
      arrays: [{ label: 'result "abcd"', cells: ['a', 'b', 'c', 'd'], tones: [DONE, DONE, DONE, DONE] }],
      pointers: [],
    }),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as StringState;
  return (
    <div>
      {state.arrays.map((arr) => (
        <div key={arr.label}>
          <p className="viz-array-label">{arr.label}</p>
          <ArrayCells values={arr.cells} tones={arr.tones} pointers={[]} />
        </div>
      ))}
      {state.pointers.length > 0 ? (
        <p className="viz-array-label">
          {state.pointers.map((p) => `${p.label} → index ${p.index}`).join(' · ')}
        </p>
      ) : null}
    </div>
  );
}

export default function StringViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
