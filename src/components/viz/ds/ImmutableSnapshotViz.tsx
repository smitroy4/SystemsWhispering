import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SnapshotState {
  labels: string[];
  rows: string[][];
  tones: CellTone[][];
  status: string;
}

function frame(
  id: string,
  description: string,
  labels: string[],
  rows: string[][],
  tones: CellTone[][],
  status: string,
): VizStep {
  return { id, description, state: { labels, rows, tones, status } satisfies SnapshotState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Draft mutates, snapshot freezes; writes to the snapshot throw. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: a mutable draft [x, y]. Anything may still change.', ['draft'], [['x', 'y']], [toneRow(2, [], D)], 'draft = [x, y] (mutable)'),
    frame('snap', 'copyOf(draft): a separate frozen array — same content, zero sharing.', ['draft', 'snapshot'], [['x', 'y'], ['x', 'y']], [toneRow(2, [], D), toneRow(2, [0, 1], S)], 'snapshot = [x, y] (frozen)'),
    frame('mutate', 'draft.add("z"): the draft grows. The snapshot does not move.', ['draft', 'snapshot'], [['x', 'y', 'z'], ['x', 'y']], [toneRow(3, [2], S), toneRow(2, [], D)], 'draft = [x, y, z] · snapshot = [x, y]'),
    frame('blocked', 'snapshot.add("w"): UnsupportedOperationException. Immutability is enforced, not advised.', ['draft', 'snapshot'], [['x', 'y', 'z'], ['x', 'y']], [toneRow(3, [], D), toneRow(2, [0, 1], A)], 'snapshot.add → throws'),
    frame('done', 'Done: snapshots share safely across threads and APIs — no defensive copies needed.', ['draft', 'snapshot'], [['x', 'y', 'z'], ['x', 'y']], [toneRow(3, [], D), toneRow(2, [0, 1], DONE)], 'frozen forever'),
  ];
}

const CELL = 52;
const GAP = 8;
const PAD = 16;
const LABEL_W = 84;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SnapshotState;
  const maxCols = Math.max(...state.rows.map((r) => r.length));
  const width = PAD * 2 + LABEL_W + maxCols * CELL + Math.max(0, maxCols - 1) * GAP;
  const height = PAD * 2 + state.rows.length * (CELL + 22) + Math.max(0, state.rows.length - 1) * 12;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Immutable snapshot beside its mutable draft"
      >
        {state.rows.map((row, r) => (
          <g key={r}>
            <text
              x={PAD + LABEL_W - 8}
              y={PAD + r * (CELL + 22 + 12) + CELL / 2 + 5}
              textAnchor="end"
              className="viz-pointer-label"
            >
              {state.labels[r]}
            </text>
            {row.map((value, i) => (
              <g
                key={`${r}-${i}`}
                className={`viz-anim viz-cell viz-tone-${state.tones[r]?.[i] ?? 'default'}`}
                style={{ transform: `translate(${PAD + LABEL_W + i * (CELL + GAP)}px, ${PAD + r * (CELL + 22 + 12)}px)` }}
              >
                <rect width={CELL} height={CELL} rx={8} />
                <text x={CELL / 2} y={CELL / 2 + 5} textAnchor="middle" className="viz-cell-value">
                  {value}
                </text>
                <text x={CELL / 2} y={CELL + 15} textAnchor="middle" className="viz-cell-index">
                  {i}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function ImmutableSnapshotViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
