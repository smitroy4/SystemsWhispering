import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface PrefixState {
  input: number[];
  pref: number[];
  inputTones: CellTone[];
  prefTones: CellTone[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Build prefix sums of [1, 2, 3, 4], then answer sum(1, 3) = P[4] − P[1] = 9. */
function buildSteps(): VizStep[] {
  const input = [1, 2, 3, 4];
  const pref = [0, 0, 0, 0, 0];
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, it: CellTone[], pt: CellTone[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { input: [...input], pref: [...pref], inputTones: [...it], prefTones: [...pt], panel: [...panel] } satisfies PrefixState,
      highlight: [],
    });
  };

  snap('start', `Build running totals for [${input.join(', ')}]. P[0] = 0 anchors everything.`, input.map(() => D), [S, D, D, D, D], [
    { label: 'phase', value: 'build' },
  ]);

  for (let i = 0; i < input.length; i++) {
    pref[i + 1] = pref[i] + input[i];
    snap(`build-${i}`, `P[${i + 1}] = P[${i}] + a[${i}] = ${pref[i]} + ${input[i]} = ${pref[i + 1]}.`, input.map((_, k) => (k === i ? A : k < i ? DONE : D)), pref.map((_, k) => (k === i + 1 ? S : k <= i ? DONE : D)), [
      { label: 'phase', value: 'build' },
      { label: `P[${i + 1}]`, value: String(pref[i + 1]) },
    ]);
  }

  snap('query', `Query sum(1, 3) = P[4] − P[1] = ${pref[4]} − ${pref[1]} = ${pref[4] - pref[1]}. One subtraction, no scan.`, input.map((_, k) => (k >= 1 && k <= 3 ? A : D)), pref.map((_, k) => (k === 4 || k === 1 ? S : DONE)), [
    { label: 'phase', value: 'query' },
    { label: 'P[4] − P[1]', value: `${pref[4]} − ${pref[1]}` },
    { label: 'result', value: String(pref[4] - pref[1]) },
  ]);

  snap('done', `Done: O(n) setup buys unlimited O(1) range sums. Updates would cost O(n) — that is the tradeoff.`, input.map(() => DONE), pref.map(() => DONE), [
    { label: 'result', value: String(pref[4] - pref[1]) },
  ]);
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as PrefixState;
  return (
    <div className="algo-scene">
      <div>
        <p className="viz-array-label">array a</p>
        <ArrayCells values={state.input} tones={state.inputTones} pointers={[]} />
        <p className="viz-array-label">prefix P</p>
        <ArrayCells values={state.pref} tones={state.prefTones} pointers={[]} />
      </div>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function PrefixSumViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
