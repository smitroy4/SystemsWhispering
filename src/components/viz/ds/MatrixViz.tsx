import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface MatrixState {
  tones: CellTone[][];
  /** Visit-order labels (spiral), null for unvisited. */
  marks: Array<Array<string | null>>;
}

const ROWS = 4;
const COLS = 4;
const VALUES: number[][] = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

function blank<T>(fill: T): T[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => fill));
}

function frame(id: string, description: string, tones: CellTone[][], marks: Array<Array<string | null>>): VizStep {
  return { id, description, state: { tones, marks } satisfies MatrixState, highlight: [] };
}

const D: CellTone = 'default';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

function rowTones(row: number): CellTone[][] {
  const t = blank<CellTone>(D);
  for (let j = 0; j < COLS; j++) t[row][j] = C;
  return t;
}

function colTones(col: number): CellTone[][] {
  const t = blank<CellTone>(D);
  for (let i = 0; i < ROWS; i++) t[i][col] = C;
  return t;
}

/** Row walk vs column walk, O(1) access, then a spiral peeling. */
function buildSteps(): VizStep[] {
  const none = blank<string | null>(null);

  const access = blank<CellTone>(D);
  access[2][1] = A;

  const marksA = blank<string | null>(null);
  marksA[0] = ['1', '2', '3', '4'];
  marksA[1][3] = '5';
  marksA[2][3] = '6';
  marksA[3][3] = '7';
  const tonesA = blank<CellTone>(D);
  for (let j = 0; j < COLS; j++) tonesA[0][j] = S;
  tonesA[1][3] = S;
  tonesA[2][3] = S;
  tonesA[3][3] = S;

  const marksB = marksA.map((row) => [...row]);
  // Spiral order: bottom row right→left is 8,9,10, then left wall up is 11,12.
  marksB[3] = ['10', '9', '8', '7'];
  marksB[2][0] = '11';
  marksB[1][0] = '12';
  const tonesB = tonesA.map((row) => [...row]);
  tonesB[3][0] = S;
  tonesB[3][1] = S;
  tonesB[3][2] = S;
  tonesB[2][0] = S;
  tonesB[1][0] = S;

  const marksC = marksB.map((row) => [...row]);
  marksC[1][1] = '13';
  marksC[1][2] = '14';
  marksC[2][2] = '15';
  marksC[2][1] = '16';
  const tonesC = tonesB.map((row) => [...row]);
  tonesC[1][1] = S;
  tonesC[1][2] = S;
  tonesC[2][2] = S;
  tonesC[2][1] = S;

  return [
    frame('start', 'Start: 4×4, rows stored one contiguous block after another (row-major).', blank<CellTone>(D), none),
    frame('row', 'Row walk m[1][*]: stride 1 — each step lands on the next cached element.', rowTones(1), none),
    frame('col', 'Column walk m[*][2]: stride 4 — nearly every step misses the cache. Same cells, slower trip.', colTones(2), none),
    frame('access', 'Access m[2][1] = 10: offset 2·4 + 1 = 9. Pure arithmetic — O(1).', access, none),
    frame('spiral-a', 'Spiral: top wall left→right (1–4), then right wall down (5–7).', tonesA, marksA),
    frame('spiral-b', 'Bottom wall right→left (8–10), then left wall up (11–12). Walls shrink inward.', tonesB, marksB),
    frame('spiral-c', 'Inner 2×2 continues (13–16). Four walls per ring, bounds re-checked each time.', tonesC, marksC),
    frame('done', 'Done: O(1) access, cache-friendly rows, and boundary discipline for patterns.', blank<CellTone>(DONE), marksC),
  ];
}

const CELL = 46;
const GAP = 6;
const PAD = 16;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as MatrixState;
  const width = PAD * 2 + COLS * CELL + (COLS - 1) * GAP;
  const height = PAD * 2 + ROWS * CELL + (ROWS - 1) * GAP + 20;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Matrix with ${ROWS} rows and ${COLS} columns`}
    >
      {VALUES.map((row, i) =>
        row.map((value, j) => {
          const x = PAD + j * (CELL + GAP);
          const y = PAD + i * (CELL + GAP);
          const mark = state.marks[i][j];
          return (
            <g
              key={`${i}-${j}`}
              className={`viz-anim viz-cell viz-tone-${state.tones[i][j] ?? 'default'}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <rect width={CELL} height={CELL} rx={8} />
              <text x={CELL / 2} y={CELL / 2 + (mark ? 1 : 5)} textAnchor="middle" className="viz-cell-value">
                {value}
              </text>
              {mark ? (
                <text x={CELL - 6} y={14} textAnchor="end" className="viz-cell-index">
                  #{mark}
                </text>
              ) : null}
              <text x={CELL / 2} y={CELL + 15} textAnchor="middle" className="viz-cell-index">
                [{i}][{j}]
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );
}

export default function MatrixViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
