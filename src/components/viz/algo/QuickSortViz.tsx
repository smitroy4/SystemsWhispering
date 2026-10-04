import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface QuickState {
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

/** Lomuto quicksort on [5, 3, 8, 4, 2, 7, 1] with a fixed demo pivot order. */
function buildSteps(): VizStep[] {
  const start = [5, 3, 8, 4, 2, 7, 1];
  const a = [...start];
  const steps: VizStep[] = [];
  const settled = new Set<number>();

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { values: [...a], tones: [...tones], pointers: [...pointers], panel: [...panel] } satisfies QuickState,
      highlight: pointers.map((p) => p.index),
    });
  };
  const baseTones = (): CellTone[] => a.map((_, k) => (settled.has(k) ? DONE : D));

  snap('start', `Quick sort [${start.join(', ')}]. Partition around a pivot, then recurse on each side.`, baseTones(), [], [
    { label: 'range', value: '[0, 6]' },
  ]);

  const sort = (lo: number, hi: number): void => {
    if (lo >= hi) {
      if (lo === hi) {
        settled.add(lo);
        snap(`single-${lo}`, `Range [${lo}, ${lo}]: a single element is sorted.`, baseTones(), [], [
          { label: 'range', value: `[${lo}, ${lo}]` },
        ]);
      }
      return;
    }
    const pivot = a[hi];
    snap(`pivot-${lo}-${hi}`, `Partition [${lo}, ${hi}]: pivot = ${pivot} (last element).`, baseTones().map((t, k) => (k === hi ? A : t)), [{ label: 'pivot', index: hi }], [
      { label: 'range', value: `[${lo}, ${hi}]` },
      { label: 'pivot', value: `${pivot} @${hi}` },
    ]);
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        snap(`swap-${lo}-${hi}-j${j}`, `${a[i]} ≤ ${pivot}: swap into the small side (boundary now ${i}).`, baseTones().map((t, k) => (k === i || k === j ? S : k === hi ? A : t)), [{ label: 'i', index: i }, { label: 'j', index: j }, { label: 'pivot', index: hi }], [
          { label: 'range', value: `[${lo}, ${hi}]` },
          { label: 'pivot', value: `${pivot} @${hi}` },
        ]);
      } else {
        snap(`skip-${lo}-${hi}-j${j}`, `${a[j]} > ${pivot}: stays on the large side.`, baseTones().map((t, k) => (k === j ? C : k === hi ? A : t)), [{ label: 'j', index: j }, { label: 'pivot', index: hi }], [
          { label: 'range', value: `[${lo}, ${hi}]` },
          { label: 'pivot', value: `${pivot} @${hi}` },
        ]);
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    settled.add(i + 1);
    snap(`placed-${lo}-${hi}`, `Pivot ${pivot} lands at ${i + 1} — its final slot. Recurse left [${lo}, ${i}] and right [${i + 2}, ${hi}].`, baseTones(), [], [
      { label: 'range', value: `[${lo}, ${hi}]` },
      { label: 'pivot final', value: String(i + 1) },
    ]);
    const p = i + 1;
    sort(lo, p - 1);
    sort(p + 1, hi);
  };
  sort(0, a.length - 1);

  snap('done', `Done: [${a.join(', ')}]. Average O(n log n); skewed pivots degrade to O(n²).`, a.map(() => DONE), [], [
    { label: 'result', value: `[${a.join(', ')}]` },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as QuickState;
  return (
    <div className="algo-scene">
      <BarChart values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function QuickSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
