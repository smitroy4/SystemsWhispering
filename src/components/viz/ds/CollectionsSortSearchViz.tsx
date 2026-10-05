import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SortSearchState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  status: string;
}

function frame(
  id: string,
  description: string,
  values: number[],
  tones: CellTone[],
  pointers: CellPointer[],
  status: string,
): VizStep {
  return { id, description, state: { values, tones, pointers, status } satisfies SortSearchState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Sort once, then binary-search the same order twice. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: unsorted list. binarySearch here would lie — sort first.', [5, 2, 8, 1, 9], toneRow(5, [], D), [], 'unsorted — searching is meaningless'),
    frame('sorted', 'Collections.sort: TimSort, stable, in place. One pass, sorted forever.', [1, 2, 5, 8, 9], toneRow(5, [], D).map(() => DONE), [], 'sorted = [1, 2, 5, 8, 9]'),
    frame('probe-1', 'binarySearch(8): mid = idx 2 (5) < 8 — discard the left half.', [1, 2, 5, 8, 9], toneRow(5, [2], C), [{ label: 'mid', index: 2 }], 'lo=0 hi=4 mid=2'),
    frame('probe-2', 'mid = idx 3 (8) — match. Two probes for five elements.', [1, 2, 5, 8, 9], toneRow(5, [3], S), [{ label: 'mid', index: 3 }], 'binarySearch(8) = 3'),
    frame('absent', 'binarySearch(7): probes land around it — absent. Returns −(insertion point) − 1 = −4.', [1, 2, 5, 8, 9], toneRow(5, [2, 3], C), [{ label: 'mid', index: 3 }], 'binarySearch(7) = -4 → insert at 3'),
    frame('done', 'Done: sort once O(n log n), every lookup O(log n) — the same-ordering contract throughout.', [1, 2, 5, 8, 9], toneRow(5, [], D).map(() => DONE), [], 'sorted + searchable'),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SortSearchState;
  return (
    <>
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} ariaLabel="Sort then binary search" />
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function CollectionsSortSearchViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
