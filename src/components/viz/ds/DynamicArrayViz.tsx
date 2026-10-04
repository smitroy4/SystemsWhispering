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

interface GrowthState {
  arrays: LabeledArray[];
  pointers: CellPointer[];
}

function frame(id: string, description: string, state: GrowthState): VizStep {
  return { id, description, state, highlight: state.pointers.map((p) => p.index) };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Push into a capacity-4 list until it must double to 8. */
function buildSteps(): VizStep[] {
  const old4 = (cells: Array<number | string>, tones: CellTone[]): LabeledArray => ({
    label: 'old (cap 4)',
    cells,
    tones,
  });
  const young8 = (cells: Array<number | string>, tones: CellTone[]): LabeledArray => ({
    label: 'new (cap 8)',
    cells,
    tones,
  });

  return [
    frame('start', 'Start: [10, 20, 30], capacity 4. Push 40 — one free slot, so O(1).', {
      arrays: [{ label: 'list (cap 4)', cells: [10, 20, 30, ''], tones: [D, D, D, D] }],
      pointers: [{ label: 'size=3', index: 3 }],
    }),
    frame('push-40', '40 lands in the last free slot. Now size == capacity == 4: the list is full.', {
      arrays: [{ label: 'list (cap 4)', cells: [10, 20, 30, 40], tones: [D, D, D, S] }],
      pointers: [{ label: 'size=4', index: 3 }],
    }),
    frame('alloc', 'Push 50 with no room: allocate a new array of double capacity (8). Copying comes next.', {
      arrays: [
        old4([10, 20, 30, 40], [D, D, D, D]),
        young8(['', '', '', '', '', '', '', ''], [D, D, D, D, D, D, D, D]),
      ],
      pointers: [],
    }),
    frame('copy-10', 'Copy index 0: 10 moves to the new array.', {
      arrays: [
        old4([10, 20, 30, 40], [A, D, D, D]),
        young8([10, '', '', '', '', '', '', ''], [S, D, D, D, D, D, D, D]),
      ],
      pointers: [],
    }),
    frame('copy-20', 'Copy index 1: 20 moves over.', {
      arrays: [
        old4([10, 20, 30, 40], [D, A, D, D]),
        young8([10, 20, '', '', '', '', '', ''], [D, S, D, D, D, D, D, D]),
      ],
      pointers: [],
    }),
    frame('copy-30', 'Copy index 2: 30 moves over.', {
      arrays: [
        old4([10, 20, 30, 40], [D, D, A, D]),
        young8([10, 20, 30, '', '', '', '', ''], [D, D, S, D, D, D, D, D]),
      ],
      pointers: [],
    }),
    frame('copy-40', 'Copy index 3: 40 moves over. The old array is garbage now.', {
      arrays: [
        old4([10, 20, 30, 40], [D, D, D, A]),
        young8([10, 20, 30, 40, '', '', '', ''], [D, D, D, S, D, D, D, D]),
      ],
      pointers: [],
    }),
    frame('push-50', 'Finally append 50 at index 4 of the new array. Four spare slots remain.', {
      arrays: [
        {
          label: 'list (cap 8)',
          cells: [10, 20, 30, 40, 50, '', '', ''],
          tones: [D, D, D, D, S, D, D, D],
        },
      ],
      pointers: [{ label: 'size=5', index: 5 }],
    }),
    frame('done', 'Done. The resize cost O(n), but the next 3 pushes are O(1) — amortized O(1) each.', {
      arrays: [
        {
          label: 'list (cap 8)',
          cells: [10, 20, 30, 40, 50, '', '', ''],
          tones: [DONE, DONE, DONE, DONE, DONE, D, D, D],
        },
      ],
      pointers: [{ label: 'size=5', index: 5 }],
    }),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as GrowthState;
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

export default function DynamicArrayViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
