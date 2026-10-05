import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SparseState {
  /** rows[k] = answered intervals of length 2^k (null = out of range). */
  rows: Array<Array<number | null>>;
  tones: CellTone[][];
  answer: string | null;
}

function frame(
  id: string,
  description: string,
  rows: Array<Array<number | null>>,
  tones: CellTone[][],
  answer: string | null = null,
): VizStep {
  return { id, description, state: { rows, tones, answer } satisfies SparseState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const A: CellTone = 'active';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

const BASE: number[] = [3, 1, 4, 1, 5, 9, 2, 6];
const ROW_K1: Array<number | null> = [1, 1, 1, 1, 5, 2, 2, null];
const ROW_K2: Array<number | null> = [1, 1, 1, 1, 2, null, null, null];
const ROW_K3: Array<number | null> = [1, null, null, null, null, null, null, null];

function rowTones(row: Array<number | null>, tone: CellTone): CellTone[] {
  return row.map((v) => (v === null ? D : tone));
}

/** Build rows k=0..3, then answer two overlapping queries. */
function buildSteps(): VizStep[] {
  const t0 = [BASE.map(() => D)];
  const t1 = [BASE.map(() => D), rowTones(ROW_K1, S)];
  const t2 = [BASE.map(() => D), rowTones(ROW_K1, D), rowTones(ROW_K2, S)];
  const t3 = [BASE.map(() => D), rowTones(ROW_K1, D), rowTones(ROW_K2, D), rowTones(ROW_K3, S)];

  // Query [2,6]: len 5 → k=2 → st[2][2]=1 and st[2][3]=1.
  const q1 = [BASE.map(() => D), rowTones(ROW_K1, D), ROW_K2.map((v, i) => (v !== null && (i === 2 || i === 3) ? A : D)), rowTones(ROW_K3, D)];
  // Query [4,5]: len 2 → k=1 → st[1][4]=5 twice (same block — idempotent, still right).
  const q2 = [BASE.map(() => D), ROW_K1.map((v, i) => (v !== null && i === 4 ? C : D)), rowTones(ROW_K2, D), rowTones(ROW_K3, D)];

  return [
    frame('start', 'Start: static array. Row k=0 is the array itself — intervals of length 1.', [BASE], t0),
    frame('build-k1', 'Row k=1: each cell = min of a length-2 pair. 7 intervals, O(n) work.', [BASE, ROW_K1], t1),
    frame('build-k2', 'Row k=2: merge two length-2 answers into length-4 intervals. Halves every row.', [BASE, ROW_K1, ROW_K2], t2),
    frame('build-k3', 'Row k=3: one cell — the whole array. Preprocessing: O(n log n), done once.', [BASE, ROW_K1, ROW_K2, ROW_K3], t3),
    frame('query-1', 'Query min[2..6]: len 5 → k=2. Combine st[2][2] and st[2][3] → min(1, 1) = 1.', [BASE, ROW_K1, ROW_K2, ROW_K3], q1, 'min[2..6] = 1'),
    frame('query-2', 'Query min[4..5]: len 2 → k=1. Both blocks are st[1][4] = 5 — overlap is harmless for min.', [BASE, ROW_K1, ROW_K2, ROW_K3], q2, 'min[4..5] = 5'),
    frame('done', 'Done: two lookups per query, forever. Static data + idempotent op = O(1) answers.', [BASE, ROW_K1, ROW_K2, ROW_K3], [BASE.map(() => DONE), rowTones(ROW_K1, DONE), rowTones(ROW_K2, DONE), rowTones(ROW_K3, DONE)], 'min[2..6] = 1'),
  ];
}

const CELL_W = 44;
const CELL_H = 36;
const GAP = 6;
const PAD = 16;
const LABEL_W = 64;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SparseState;
  const maxCols = Math.max(...state.rows.map((r) => r.length));
  const width = PAD * 2 + LABEL_W + maxCols * CELL_W + Math.max(0, maxCols - 1) * GAP;
  const height = PAD * 2 + state.rows.length * CELL_H + Math.max(0, state.rows.length - 1) * GAP + (state.answer ? 30 : 0);

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Sparse table with ${state.rows.length} rows`}
      >
        {state.rows.map((row, k) => (
          <g key={k}>
            <text
              x={PAD + LABEL_W - 8}
              y={PAD + k * (CELL_H + GAP) + CELL_H / 2 + 5}
              textAnchor="end"
              className="viz-pointer-label"
            >
              len {2 ** k}
            </text>
            {row.map((value, i) => {
              if (value === null) return null;
              const x = PAD + LABEL_W + i * (CELL_W + GAP);
              const y = PAD + k * (CELL_H + GAP);
              return (
                <g
                  key={`${k}-${i}`}
                  className={`viz-anim viz-cell viz-tone-${state.tones[k]?.[i] ?? 'default'}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <rect width={CELL_W} height={CELL_H} rx={8} />
                  <text x={CELL_W / 2} y={CELL_H / 2 + 5} textAnchor="middle" className="viz-cell-value">
                    {value}
                  </text>
                  <text x={CELL_W / 2} y={CELL_H - 4} textAnchor="middle" className="viz-cell-index">
                    {i}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      {state.answer ? <p className="viz-statusline">answer = <strong>{state.answer}</strong></p> : null}
    </>
  );
}

export default function SparseTableViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
