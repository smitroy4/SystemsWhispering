import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface InsertionState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Insertion sort [5, 3, 8, 4, 2]: hold each key, shift, insert. */
function buildSteps(): VizStep[] {
  const start = [5, 3, 8, 4, 2];
  const a = [...start];
  const n = a.length;
  const steps: VizStep[] = [];
  let shifts = 0;

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], key: string): void => {
    steps.push({
      id,
      description,
      state: {
        values: [...a],
        tones: [...tones],
        pointers: [...pointers],
        panel: [
          { label: 'key', value: key },
          { label: 'shifts', value: String(shifts) },
        ],
      } satisfies InsertionState,
      highlight: pointers.map((p) => p.index),
    });
  };
  const settled = (upto: number): CellTone[] => a.map((_, k) => (k < upto ? DONE : D));

  snap('start', `Insertion sort [${start.join(', ')}]. Prefix [0, 1) is already "sorted".`, settled(1), [], '—');

  for (let i = 1; i < n; i++) {
    const key = a[i];
    snap(`key-${i}`, `Hold key = ${key} from position ${i}; shift larger prefix values right.`, a.map((_, k) => (k < i ? DONE : k === i ? A : D)), [{ label: 'key', index: i }], String(key));
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      shifts++;
      snap(`shift-${i}-${j}`, `${a[j]} > ${key}: shift it right into slot ${j + 1}.`, a.map((_, k) => (k <= i ? (k === j + 1 ? A : DONE) : D)), [{ label: 'key', index: i }, { label: 'j', index: j }], String(key));
      j--;
    }
    a[j + 1] = key;
    snap(`insert-${i}`, `Write ${key} into the gap at ${j + 1}. Prefix [0, ${i + 1}) sorted.`, a.map((_, k) => (k <= i ? (k === j + 1 ? S : DONE) : D)), [], String(key));
  }

  snap('done', `Done: [${a.join(', ')}] with ${shifts} shifts. Nearly sorted input barely shifts: O(n).`, a.map(() => DONE), [], '—');
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as InsertionState;
  return (
    <div className="algo-scene">
      <BarChart values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function InsertionSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
