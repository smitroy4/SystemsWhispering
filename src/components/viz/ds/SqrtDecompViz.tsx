import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SqrtState {
  values: number[];
  tones: CellTone[];
  blockSums: number[];
  blockTones: CellTone[];
  updatedBlock: number;
  status: string;
}

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const BLOCK = 3;

function frame(
  id: string,
  description: string,
  values: number[],
  tones: CellTone[],
  blockSums: number[],
  blockTones: CellTone[],
  updatedBlock: number,
  status: string,
): VizStep {
  return { id, description, state: { values, tones, blockSums, blockTones, updatedBlock, status } satisfies SqrtState, highlight: [] };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function cellTones(active: number[], tone: CellTone): CellTone[] {
  return VALUES.map((_, i) => (active.includes(i) ? tone : D));
}

/** Query sum[2..7], then point-update index 4. */
function buildSteps(): VizStep[] {
  const sums = [6, 15, 24];
  const sums2 = [6, 20, 24];
  return [
    frame('start', 'Start: 9 elements, blocks of 3, one summary each: 6, 15, 24.', VALUES, cellTones([], D), sums, [D, D, D], -1, 'blocks = [6, 15, 24]'),
    frame('edge-left', 'Query sum[2..7]: scan the partial left edge — just index 2 (value 3).', VALUES, cellTones([2], A), sums, [D, D, D], -1, 'edge = 3'),
    frame('whole', 'Whole block 1 sits inside [2..7]: add its summary 15 in O(1).', VALUES, cellTones([2], D), sums, [D, C, D], -1, 'edge 3 + block 15'),
    frame('edge-right', 'Scan the partial right edge: indices 6, 7 (values 7, 8).', VALUES, cellTones([6, 7], A), sums, [D, D, D], -1, '3 + 15 + 15'),
    frame('answer', 'Answer: 3 + 15 + 15 = 33. Two short scans plus skipped middles.', VALUES, cellTones([2, 6, 7], S), sums, [D, C, D], -1, 'sum[2..7] = 33'),
    frame('update', 'Update a[4] = 10 (was 5): one write plus block 1 → 20. Min/max would rescan.', [1, 2, 3, 4, 10, 6, 7, 8, 9], cellTones([4], S), sums2, [D, S, D], 1, 'blocks = [6, 20, 24]'),
    frame('done', 'Done: edges scanned, middles skipped — O(√n) with two plain arrays.', [1, 2, 3, 4, 10, 6, 7, 8, 9], cellTones([], D).map(() => DONE), sums2, [DONE, DONE, DONE], -1, 'sum[2..7] = 38'),
  ];
}

const CELL = 40;
const GAP = 6;
const BLOCK_GAP = 16;
const PAD = 16;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SqrtState;
  const n = state.values.length;
  const blocks = state.blockSums.length;
  const xOf = (i: number) => PAD + i * (CELL + GAP) + Math.floor(i / BLOCK) * (BLOCK_GAP - GAP);
  const width = xOf(n - 1) + CELL + PAD;
  const cellY = PAD + 26;
  const sumY = cellY + CELL + 34;
  const height = sumY + CELL + PAD;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Square root decomposition with ${blocks} blocks`}
      >
        {state.values.map((value, i) => (
          <g
            key={i}
            className={`viz-anim viz-cell viz-tone-${state.tones[i] ?? 'default'}`}
            style={{ transform: `translate(${xOf(i)}px, ${cellY}px)` }}
          >
            <rect width={CELL} height={CELL} rx={8} />
            <text x={CELL / 2} y={CELL / 2 + 5} textAnchor="middle" className="viz-cell-value">
              {value}
            </text>
            <text x={CELL / 2} y={CELL + 14} textAnchor="middle" className="viz-cell-index">
              {i}
            </text>
          </g>
        ))}
        {state.blockSums.map((sum, b) => {
          const first = b * BLOCK;
          const last = Math.min(n, first + BLOCK) - 1;
          const cx = (xOf(first) + xOf(last) + CELL) / 2;
          return (
            <g key={`b${b}`}>
              <text x={cx} y={sumY - 8} textAnchor="middle" className="viz-pointer-label">
                block {b}
              </text>
              <g
                className={`viz-anim viz-cell viz-tone-${state.blockTones[b] ?? 'default'}`}
                style={{ transform: `translate(${cx - 34}px, ${sumY}px)` }}
              >
                <rect width={68} height={CELL} rx={8} />
                <text x={34} y={CELL / 2 + 5} textAnchor="middle" className="viz-cell-value">
                  Σ={sum}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function SqrtDecompViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
