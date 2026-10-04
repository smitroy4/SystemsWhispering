import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SelectionState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const C: CellTone = 'compared';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Selection sort [5, 3, 8, 4, 2]: scan for each minimum, swap into place. */
function buildSteps(): VizStep[] {
  const start = [5, 3, 8, 4, 2];
  const a = [...start];
  const n = a.length;
  const steps: VizStep[] = [];
  let comparisons = 0;

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { values: [...a], tones: [...tones], pointers: [...pointers], panel: [...panel] } satisfies SelectionState,
      highlight: pointers.map((p) => p.index),
    });
  };
  const panelFor = (i: number, min: number): StateEntry[] => [
    { label: 'pass i', value: String(i) },
    { label: 'min', value: `${min} (value ${a[min]})` },
    { label: 'comparisons', value: String(comparisons) },
  ];

  snap('start', `Selection sort [${start.join(', ')}]. Each pass selects the minimum of the rest.`, a.map(() => D), [], [
    { label: 'comparisons', value: '0' },
  ]);

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      if (a[j] < a[min]) {
        min = j;
        snap(`newmin-p${i}-j${j}`, `Pass ${i + 1}: a[${j}] = ${a[j]} is the new minimum.`, a.map((_, k) => (k < i ? DONE : k === j ? A : D)), [{ label: 'j', index: j }, { label: 'min', index: min }], panelFor(i, min));
      } else {
        snap(`scan-p${i}-j${j}`, `Pass ${i + 1}: a[${j}] = ${a[j]} ≥ current min ${a[min]}.`, a.map((_, k) => (k < i ? DONE : k === j ? C : k === min ? A : D)), [{ label: 'j', index: j }, { label: 'min', index: min }], panelFor(i, min));
      }
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      snap(`swap-p${i}`, `Pass ${i + 1}: swap minimum ${a[i]} into position ${i}.`, a.map((_, k) => (k < i ? DONE : k === i ? S : D)), [{ label: 'i', index: i }], panelFor(i, i));
    } else {
      snap(`noswap-p${i}`, `Pass ${i + 1}: position ${i} already held the minimum — no swap.`, a.map((_, k) => (k < i ? DONE : k === i ? S : D)), [{ label: 'i', index: i }], panelFor(i, i));
    }
  }

  snap('done', `Done: [${a.join(', ')}] in ${comparisons} comparisons. Always O(n²), only O(n) swaps.`, a.map(() => DONE), [], [
    { label: 'comparisons', value: String(comparisons) },
    { label: 'result', value: `[${a.join(', ')}]` },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SelectionState;
  return (
    <div className="algo-scene">
      <BarChart values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function SelectionSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
