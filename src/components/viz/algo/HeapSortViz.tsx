import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface HeapSortState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Heap sort [5, 3, 8, 4, 2]: bottom-up heapify, then extract into place. */
function buildSteps(): VizStep[] {
  const start = [5, 3, 8, 4, 2];
  const a = [...start];
  const n = a.length;
  const steps: VizStep[] = [];
  const settled = new Set<number>();
  let heapSize = n;

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { values: [...a], tones: [...tones], pointers: [...pointers], panel: [...panel] } satisfies HeapSortState,
      highlight: pointers.map((p) => p.index),
    });
  };
  const baseTones = (): CellTone[] => a.map((_, k) => (settled.has(k) ? DONE : D));

  const sink = (i: number, size: number): void => {
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < size && a[left] > a[largest]) largest = left;
      if (right < size && a[right] > a[largest]) largest = right;
      if (largest === i) break;
      [a[i], a[largest]] = [a[largest], a[i]];
      snap(`sink-${i}-${largest}`, `Sink: swap ${a[largest]} down with larger child ${a[i]}.`, baseTones().map((t, k) => (k === i || k === largest ? S : t)), [{ label: 'i', index: i }], [
        { label: 'heap size', value: String(size) },
      ]);
      i = largest;
    }
  };

  snap('start', `Heap sort [${start.join(', ')}]. Phase 1: heapify bottom-up in O(n).`, baseTones(), [], [
    { label: 'phase', value: 'heapify' },
  ]);
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    snap(`heapify-${i}`, `Heapify: sink index ${i} (${a[i]}).`, baseTones().map((t, k) => (k === i ? A : t)), [{ label: 'i', index: i }], [
      { label: 'phase', value: 'heapify' },
    ]);
    sink(i, n);
  }
  snap('heap-ready', `Max-heap ready: ${a[0]} on top. Phase 2: extract into place.`, baseTones(), [], [
    { label: 'phase', value: 'extract' },
  ]);

  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    heapSize = end;
    settled.add(end);
    snap(`extract-${end}`, `Swap max ${a[end]} into slot ${end} — final. Shrink heap to ${end}.`, baseTones(), [], [
      { label: 'phase', value: 'extract' },
      { label: 'heap size', value: String(heapSize) },
    ]);
    sink(0, end);
  }
  settled.add(0);

  snap('done', `Done: [${a.join(', ')}]. Guaranteed O(n log n), in place, not stable.`, a.map(() => DONE), [], [
    { label: 'result', value: `[${a.join(', ')}]` },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as HeapSortState;
  return (
    <div className="algo-scene">
      <BarChart values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function HeapSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
