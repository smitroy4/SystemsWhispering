import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface Dp1dState {
  values: Array<number | string>;
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Climbing stairs n=5: dp[i] = dp[i-1] + dp[i-2], seeds dp[1]=1, dp[2]=2. */
function buildSteps(): VizStep[] {
  const n = 5;
  const dp: Array<number | string> = new Array<string | number>(n + 1).fill('');
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, tones: CellTone[], pointers: CellPointer[], panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: { values: [...dp], tones: [...tones], pointers: [...pointers], panel: [...panel] } satisfies Dp1dState,
      highlight: pointers.map((p) => p.index),
    });
  };

  snap('start', 'Ways to climb 5 stairs (1 or 2 at a time). dp[i] = dp[i-1] + dp[i-2]. Seed the bases.', dp.map(() => D), [], [
    { label: 'dp[1]', value: '1' },
    { label: 'dp[2]', value: '2' },
  ]);
  dp[1] = 1;
  dp[2] = 2;
  snap('seed', 'Bases set: 1 way to stand on step 1, 2 ways to reach step 2.', dp.map((_, k) => (k === 1 || k === 2 ? S : D)), [{ label: 'i=2', index: 2 }], [
    { label: 'dp[1]', value: '1' },
    { label: 'dp[2]', value: '2' },
  ]);

  for (let i = 3; i <= n; i++) {
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number);
    snap(`fill-${i}`, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`, dp.map((_, k) => (k === i ? S : k < i && k >= 1 ? DONE : D)), [{ label: `i=${i}`, index: i }], [
      { label: `dp[${i}]`, value: String(dp[i]) },
    ]);
  }

  steps.push({
    id: 'done',
    description: `Done: dp[5] = 8 ways. Five cells, one pass: O(n) time, O(n) space (O(1) with two variables).`,
    state: {
      values: [...dp],
      tones: dp.map(() => DONE),
      pointers: [],
      panel: [
        { label: 'answer dp[5]', value: '8' },
      ],
    } satisfies Dp1dState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as Dp1dState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function Dp1dViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
