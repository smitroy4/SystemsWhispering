import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface KnapsackState {
  rows: number[][];
  tones: CellTone[][];
  trace: Array<[number, number]>;
  panel: StateEntry[];
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

const WEIGHT = [1, 3, 4, 5];
const VALUE = [1, 4, 5, 7];
const CAP = 7;

/** 0/1 knapsack: one frame per completed item row, then traceback. */
function buildSteps(): VizStep[] {
  const n = WEIGHT.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(CAP + 1).fill(0));
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, doneRow: number, trace: Array<[number, number]>, panel: StateEntry[]): void => {
    const inTrace = (r: number, c: number): boolean => trace.some(([tr, tc]) => tr === r && tc === c);
    steps.push({
      id,
      description,
      state: {
        rows: dp.map((row) => [...row]),
        tones: dp.map((row, r) =>
          row.map((_, c) => {
            if (inTrace(r, c)) return S;
            if (r <= doneRow) return DONE;
            return D;
          }),
        ),
        trace: [...trace],
        panel: [...panel],
      } satisfies KnapsackState,
      highlight: [],
    });
  };

  snap('start', `Pack capacity ${CAP} from weights [${WEIGHT.join(', ')}] / values [${VALUE.join(', ')}]. Row 0 (no items) is all zeros.`, 0, [], [
    { label: 'answer', value: `dp[4][7] = ?` },
  ]);

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= CAP; w++) {
      dp[i][w] = dp[i - 1][w];
      if (WEIGHT[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], VALUE[i - 1] + dp[i - 1][w - WEIGHT[i - 1]]);
      }
    }
    snap(`row-${i}`, `Row ${i} (weight ${WEIGHT[i - 1]}, value ${VALUE[i - 1]}): skip everywhere, take where it fits and wins. Best so far: ${dp[i][CAP]}.`, i, [], [
      { label: 'item', value: `w=${WEIGHT[i - 1]}, v=${VALUE[i - 1]}` },
      { label: `dp[${i}][${CAP}]`, value: String(dp[i][CAP]) },
    ]);
  }

  // Traceback: taken items walk diagonally, skipped items walk up.
  const trace: Array<[number, number]> = [];
  let w = CAP;
  const taken: number[] = [];
  for (let i = n; i >= 1; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      trace.push([i, w]);
      taken.push(i - 1);
      w -= WEIGHT[i - 1];
    }
  }
  snap('trace', `Traceback from dp[4][7]: diagonal steps mark taken items — weights [${taken.map((t) => WEIGHT[t]).join(', ')}].`, n, trace, [
    { label: 'taken weights', value: `[${taken.map((t) => WEIGHT[t]).join(', ')}]` },
    { label: 'answer', value: String(dp[n][CAP]) },
  ]);

  steps.push({
    id: 'done',
    description: `Done: best value ${dp[n][CAP]} (3 + 4 weight → 4 + 5 value). O(n·W) time, pseudo-polynomial.`,
    state: {
      rows: dp.map((row) => [...row]),
      tones: dp.map((row) => row.map(() => DONE)),
      trace: [...trace],
      panel: [
        { label: 'answer', value: String(dp[n][CAP]) },
      ],
    } satisfies KnapsackState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as KnapsackState;
  return (
    <div className="algo-scene">
      <div>
        {state.rows.map((row, r) => (
          <div key={r}>
            <p className="viz-array-label">{r === 0 ? 'no items' : `+ w=${WEIGHT[r - 1]} v=${VALUE[r - 1]}`}</p>
            <ArrayCells values={row} tones={state.tones[r] ?? []} pointers={[]} />
          </div>
        ))}
      </div>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function KnapsackViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
