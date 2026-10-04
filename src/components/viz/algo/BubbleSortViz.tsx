import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BubbleState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const C: CellTone = 'compared';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Bubble sort [5, 3, 8, 4, 2]: every compare and swap is a frame. */
function buildSteps(): VizStep[] {
  const start = [5, 3, 8, 4, 2];
  const a = [...start];
  const n = a.length;
  const steps: VizStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[]): void => {
    steps.push({
      id,
      description,
      state: {
        values: [...a],
        tones: [...tones],
        pointers: [...pointers],
        panel: [
          { label: 'comparisons', value: String(comparisons) },
          { label: 'swaps', value: String(swaps) },
        ],
      } satisfies BubbleState,
      highlight: pointers.map((p) => p.index),
    });
  };

  snap('start', `Bubble sort [${start.join(', ')}]. Compare neighbors; big values float right.`, a.map(() => D), []);
  const settled = new Set<number>();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        swapped = true;
        snap(
          `swap-p${i}-j${j}`,
          `Pass ${i + 1}: ${a[j + 1]} > ${a[j]} — swap.`,
          a.map((_, k) => (k === j || k === j + 1 ? S : settled.has(k) ? DONE : D)),
          [{ label: 'j', index: j }],
        );
      } else {
        snap(
          `keep-p${i}-j${j}`,
          `Pass ${i + 1}: ${a[j]} ≤ ${a[j + 1]} — already ordered, no swap.`,
          a.map((_, k) => (k === j || k === j + 1 ? C : settled.has(k) ? DONE : D)),
          [{ label: 'j', index: j }],
        );
      }
    }
    settled.add(n - 1 - i);
    snap(
      `pass-${i}-done`,
      `Pass ${i + 1} done: position ${n - 1 - i} holds its final value.${swapped ? '' : ' No swaps at all — array sorted, stopping early.'}`,
      a.map((_, k) => (settled.has(k) ? DONE : D)),
      [],
    );
    if (!swapped) break;
  }

  for (let k = 0; k < n; k++) settled.add(k);
  snap('done', `Done: [${a.join(', ')}] in ${comparisons} comparisons, ${swaps} swaps. Worst case O(n²).`, a.map(() => DONE), []);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BubbleState;
  return (
    <div className="algo-scene">
      <BarChart values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function BubbleSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
