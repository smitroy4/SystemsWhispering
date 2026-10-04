import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface DcState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';

/** Max subarray D&C on [-2, 1, -3, 4]: split, solve halves, cross at mid. */
function buildSteps(): VizStep[] {
  const values = [-2, 1, -3, 4];
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { values: [...values], tones: [...tones], pointers: [...pointers], panel: [...panel] } satisfies DcState,
      highlight: pointers.map((p) => p.index),
    });
  };
  const range = (lo: number, hi: number, tone: CellTone): CellTone[] =>
    values.map((_, k) => (k >= lo && k <= hi ? tone : D));

  snap('start', `Max subarray of [${values.join(', ')}]: best lies left, right, or crossing mid.`, values.map(() => D), [], [
    { label: 'range', value: '[0, 3]' },
  ]);
  snap('split', 'Split [0, 3] → [0, 1] + [2, 3]. Conquer each half first.', range(0, 3, A), [
    { label: 'lo=0', index: 0 },
    { label: 'mid=1', index: 1 },
    { label: 'hi=3', index: 3 },
  ], [{ label: 'range', value: '[0, 3]' }]);
  snap('left-best', 'Left half [-2, 1]: best is [1] alone = 1. (Single scan: max suffix ending at mid.)', [-2, 1, -3, 4].map((_, k) => (k === 1 ? S : k === 0 ? C : D)), [
    { label: 'lo=0', index: 0 },
    { label: 'hi=1', index: 1 },
  ], [
    { label: 'left best', value: '1' },
  ]);
  snap('right-best', 'Right half [-3, 4]: best is [4] alone = 4.', values.map((_, k) => (k === 3 ? S : k === 2 ? C : D)), [
    { label: 'lo=2', index: 2 },
    { label: 'hi=3', index: 3 },
  ], [
    { label: 'left best', value: '1' },
    { label: 'right best', value: '4' },
  ]);
  snap('cross', 'Crossing mid: best left suffix (1) + best right prefix (4 + −3 = 1) = 2. Max(1, 4, 2) = 4.', values.map((_, k) => (k === 1 || k === 3 ? S : k === 2 ? A : D)), [
    { label: 'lo=0', index: 0 },
    { label: 'mid=1', index: 1 },
    { label: 'hi=3', index: 3 },
  ], [
    { label: 'left best', value: '1' },
    { label: 'right best', value: '4' },
    { label: 'cross', value: '2' },
  ]);
  snap('done', 'Done: answer 4 (subarray [4]). Recurrence T(n) = 2T(n/2) + O(n) → O(n log n).', values.map((_, k) => (k === 3 ? S : D)), [], [
    { label: 'answer', value: '4' },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as DcState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function DivideConquerViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
