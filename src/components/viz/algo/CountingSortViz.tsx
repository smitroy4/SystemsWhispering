import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface CountingState {
  input: number[];
  inputTones: CellTone[];
  counts: number[];
  countTones: CellTone[];
  output: Array<number | string>;
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Counting sort [4, 2, 2, 8, 3, 2, 4]: tally, then write back in order. */
function buildSteps(): VizStep[] {
  const input = [4, 2, 2, 8, 3, 2, 4];
  const max = Math.max(...input);
  const counts = new Array<number>(max + 1).fill(0);
  const output: Array<number | string> = new Array<string | number>(input.length).fill('');
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, it: CellTone[], ct: CellTone[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { input: [...input], inputTones: [...it], counts: [...counts], countTones: [...ct], output: [...output], panel: [...panel] } satisfies CountingState,
      highlight: [],
    });
  };

  snap('start', `Counting sort [${input.join(', ')}]. Phase 1: tally each value (max ${max}, so ${max + 1} counters).`, input.map(() => D), counts.map(() => D), [
    { label: 'phase', value: 'count' },
  ]);

  input.forEach((x, idx) => {
    counts[x]++;
    snap(`count-${idx}`, `Read ${x}: count[${x}] → ${counts[x]}.`, input.map((_, k) => (k === idx ? A : k < idx ? DONE : D)), counts.map((_, k) => (k === x ? S : D)), [
      { label: 'phase', value: 'count' },
      { label: 'reading', value: `${x} @${idx}` },
    ]);
  });

  let placed = 0;
  for (let v = 0; v < counts.length; v++) {
    while (counts[v] > 0) {
      output[placed] = v;
      counts[v]--;
      placed++;
      snap(`place-${v}-${placed}`, `Write ${v} to output[${placed - 1}] (${counts[v]} of them left).`, input.map(() => DONE), counts.map((_, k) => (k === v ? A : D)), [
        { label: 'phase', value: 'write back' },
        { label: 'writing', value: `${v} @${placed - 1}` },
        { label: 'placed', value: `${placed}/${input.length}` },
      ]);
    }
  }

  snap('done', `Done: [${input.map((_, k) => output[k]).join(', ')}] in n + k steps. Small range required: O(n + k).`, input.map(() => DONE), counts.map(() => DONE), [
    { label: 'result', value: `[${output.join(', ')}]` },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as CountingState;
  return (
    <div className="algo-scene">
      <div>
        <p className="viz-array-label">input</p>
        <ArrayCells values={state.input} tones={state.inputTones} pointers={[]} />
        <p className="viz-array-label">counts</p>
        <ArrayCells values={state.counts} tones={state.countTones} pointers={[]} />
        <p className="viz-array-label">output</p>
        <ArrayCells values={state.output} tones={state.output.map((v) => (v === '' ? D : DONE))} pointers={[]} />
      </div>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function CountingSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
