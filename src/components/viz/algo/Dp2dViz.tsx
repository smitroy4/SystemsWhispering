import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface Dp2dState {
  rows: number[][];
  tones: CellTone[][];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Unique paths on 3×3: borders 1, interior = top + left. Answer dp[2][2] = 6. */
function buildSteps(): VizStep[] {
  const R = 3;
  const C = 3;
  const grid: number[][] = Array.from({ length: R }, () => new Array<number>(C).fill(0));
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, toneAt: (r: number, c: number) => CellTone, panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: {
        rows: grid.map((row) => [...row]),
        tones: grid.map((row, r) => row.map((_, c) => toneAt(r, c))),
        panel: [...panel],
      } satisfies Dp2dState,
      highlight: [],
    });
  };

  snap('start', 'Unique paths on a 3×3 grid: moves only right/down. Seed borders with 1s (one route along an edge).', () => D, [
    { label: 'answer', value: 'dp[2][2] = ?' },
  ]);

  for (let r = 0; r < R; r++) grid[r][0] = 1;
  for (let c = 0; c < C; c++) grid[0][c] = 1;
  snap('seed', 'Borders seeded: first row and column are all 1s.', (r, c) => (r === 0 || c === 0 ? S : D), [
    { label: 'borders', value: 'all 1s' },
  ]);

  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      grid[r][c] = grid[r - 1][c] + grid[r][c - 1];
      snap(`fill-${r}-${c}`, `dp[${r}][${c}] = top ${grid[r - 1][c]} + left ${grid[r][c - 1]} = ${grid[r][c]}.`, (rr, cc) => {
        if (rr === r && cc === c) return S;
        if (rr < r || (rr === r && cc < c) || rr === 0 || cc === 0) return DONE;
        return D;
      }, [
        { label: 'cell', value: `[${r}, ${c}]` },
        { label: 'top + left', value: `${grid[r - 1][c]} + ${grid[r][c - 1]}` },
        { label: 'value', value: String(grid[r][c]) },
      ]);
    }
  }

  steps.push({
    id: 'done',
    description: `Done: dp[2][2] = ${grid[2][2]} paths. R·C cells, one pass: O(R·C) time.`,
    state: {
      rows: grid.map((row) => [...row]),
      tones: grid.map((row) => row.map(() => DONE)),
      panel: [{ label: 'answer', value: `dp[2][2] = ${grid[2][2]}` }],
    } satisfies Dp2dState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as Dp2dState;
  return (
    <div className="algo-scene">
      <div>
        {state.rows.map((row, r) => (
          <div key={r}>
            <p className="viz-array-label">{`row ${r}`}</p>
            <ArrayCells values={row} tones={state.tones[r] ?? []} pointers={[]} />
          </div>
        ))}
      </div>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function Dp2dViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
