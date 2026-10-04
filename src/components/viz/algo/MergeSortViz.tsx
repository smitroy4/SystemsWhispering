import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface MergeState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Merge sort [5, 3, 8, 4, 2]: split frames, then a frame per completed merge. */
function buildSteps(): VizStep[] {
  const start = [5, 3, 8, 4, 2];
  const a = [...start];
  const steps: VizStep[] = [];
  let merges = 0;

  const rangePointers = (lo: number, mid: number, hi: number): CellPointer[] => [
    { label: `lo=${lo}`, index: lo },
    { label: `mid=${mid}`, index: mid },
    { label: `hi=${hi}`, index: hi },
  ];
  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { values: [...a], tones: [...tones], pointers: [...pointers], panel: [...panel] } satisfies MergeState,
      highlight: pointers.map((p) => p.index),
    });
  };

  snap('start', `Merge sort [${start.join(', ')}]. Split to singletons, then merge sorted runs.`, a.map(() => D), [], [
    { label: 'merges', value: '0' },
  ]);

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) return;
    const mid = lo + Math.floor((hi - lo) / 2);
    snap(`split-${lo}-${hi}`, `Split [${lo}, ${hi}] → [${lo}, ${mid}] + [${mid + 1}, ${hi}].`, a.map((_, k) => (k >= lo && k <= hi ? A : D)), rangePointers(lo, mid, hi), [
      { label: 'range', value: `[${lo}, ${hi}]` },
      { label: 'merges', value: String(merges) },
    ]);
    sort(lo, mid);
    sort(mid + 1, hi);
    // Merge [lo, mid] + [mid+1, hi] (both sorted by induction).
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    for (let k = lo; k <= hi; k++) {
      if (j >= right.length || (i < left.length && left[i] <= right[j])) {
        a[k] = left[i++];
      } else {
        a[k] = right[j++];
      }
    }
    merges++;
    snap(`merge-${lo}-${hi}`, `Merge [${lo}, ${mid}] + [${mid + 1}, ${hi}] → sorted run written back.`, a.map((_, k) => (k >= lo && k <= hi ? S : D)), rangePointers(lo, mid, hi), [
      { label: 'range', value: `[${lo}, ${hi}]` },
      { label: 'merges', value: String(merges) },
    ]);
  };
  sort(0, a.length - 1);

  snap('done', `Done: [${a.join(', ')}] after ${merges} merges. Every level costs n: O(n log n), always.`, a.map(() => DONE), [], [
    { label: 'merges', value: String(merges) },
    { label: 'result', value: `[${a.join(', ')}]` },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as MergeState;
  return (
    <div className="algo-scene">
      <BarChart values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function MergeSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
