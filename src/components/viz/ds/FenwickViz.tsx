import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BitState {
  cells: Array<number | string>;
  tones: CellTone[];
}

function frame(id: string, description: string, cells: Array<number | string>, tones: CellTone[]): VizStep {
  return {
    id,
    description,
    state: { cells, tones } satisfies BitState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';

/** Data [3,1,4,1,5,9,2]: add +2 at 3 (touch 3 → 4), then prefix sum of 5 (take 5, 4). */
function buildSteps(): VizStep[] {
  const base = ['–', 3, 4, 4, 9, 5, 14, 2];
  const T = (active: number[], hot: number[], seen: number[]): CellTone[] =>
    base.map((_, i) => {
      if (active.includes(i)) return A;
      if (hot.includes(i)) return S;
      if (seen.includes(i)) return C;
      return D;
    });

  return [
    frame(
      'start',
      'BIT for [3,1,4,1,5,9,2] (slot 0 unused). bit[i] covers lowbit(i) elements: bit[4] covers 4, bit[6] covers 2, odd slots cover 1.',
      base,
      T([], [], []),
    ),
    frame(
      'add-3',
      'add(3, +2): lowbit(3)=1, so touch bit[3]: 4 → 6. Next i = 3 + 1 = 4.',
      ['–', 3, 4, 6, 9, 5, 14, 2],
      T([3], [3], []),
    ),
    frame(
      'add-4',
      'i=4: lowbit(4)=4, touch bit[4]: 9 → 11. Next i = 4 + 4 = 8 — past the end, stop.',
      ['–', 3, 4, 6, 11, 5, 14, 2],
      T([4], [3, 4], []),
    ),
    frame(
      'sum-5',
      'prefixSum(5): take bit[5]=5 (covers just index 5). Running total 5. Next i = 5 − 1 = 4.',
      ['–', 3, 4, 6, 11, 5, 14, 2],
      T([5], [5], [3, 4]),
    ),
    frame(
      'sum-4',
      'i=4: take bit[4]=11 (covers 1–4). Total 5 + 11 = 16. Next i = 4 − 4 = 0, stop.',
      ['–', 3, 4, 6, 11, 5, 14, 2],
      T([4], [5, 4], [3]),
    ),
    frame(
      'done',
      'Done: 2 touched indices per walk. Updates and queries both visit O(log n) slots.',
      ['–', 3, 4, 6, 11, 5, 14, 2],
      T([], [], []),
    ),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BitState;
  return (
    <div>
      <p className="viz-array-label">bit array (index labels = BIT positions)</p>
      <ArrayCells values={state.cells} tones={state.tones} pointers={[]} />
    </div>
  );
}

export default function FenwickViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
