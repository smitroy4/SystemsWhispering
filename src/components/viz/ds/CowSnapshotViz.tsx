import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface CowState {
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
  return { id, description, state: { labels, rows, tones, status } satisfies CowState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Cursor pins v0 while a writer publishes v1 — staleness by design. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: current array [A, B]. Readers grab this reference — no locks involved.', ['current'], [['A', 'B']], [toneRow(2, [], D)], 'current = [A, B]'),
    frame('cursor', 'Cursor C1 starts: it pins the CURRENT array. Whatever publishes next, C1 keeps this one.', ['current', 'C1 pins'], [['A', 'B'], ['A', 'B']], [toneRow(2, [], D), toneRow(2, [0, 1], C)], 'C1 sees [A, B]'),
    frame('write', 'add(C): lock, copy to [A, B, C], publish. Writers serialize; readers never wait.', ['current', 'C1 pins'], [['A', 'B', 'C'], ['A', 'B']], [toneRow(3, [2], S), toneRow(2, [], D)], 'published [A, B, C] — C1 unaffected'),
    frame('stale', 'C1 finishes on the OLD array: sees A, B — never C. Stable, but stale by design.', ['current', 'C1 pins'], [['A', 'B', 'C'], ['A', 'B']], [toneRow(3, [], D), toneRow(2, [0, 1], DONE)], 'C1 saw [A, B] only'),
    frame('done', 'Done: O(n) writes buy lock-free, throw-free reads — the read-heavy bargain.', ['current'], [['A', 'B', 'C']], [toneRow(3, [], D).map(() => DONE)], 'reads free · writes copy'),
  ];
}

const CELL = 44;
const GAP = 8;
const PAD = 16;
const LABEL_W = 84;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as CowState;
  const maxCols = Math.max(...state.rows.map((r) => r.length));
  const width = PAD * 2 + LABEL_W + maxCols * CELL + Math.max(0, maxCols - 1) * GAP;
  const height = PAD * 2 + state.rows.length * (CELL + 20) + Math.max(0, state.rows.length - 1) * 10;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Copy-on-write array versions"
      >
        {state.rows.map((row, r) => (
          <g key={r}>
            <text
              x={PAD + LABEL_W - 8}
              y={PAD + r * (CELL + 20 + 10) + CELL / 2 + 5}
              textAnchor="end"
              className="viz-pointer-label"
            >
              {state.labels[r]}
            </text>
            {row.map((value, i) => (
              <g
                key={`${r}-${i}`}
                className={`viz-anim viz-cell viz-tone-${state.tones[r]?.[i] ?? 'default'}`}
                style={{ transform: `translate(${PAD + LABEL_W + i * (CELL + GAP)}px, ${PAD + r * (CELL + 20 + 10)}px)` }}
              >
                <rect width={CELL} height={CELL} rx={8} />
                <text x={CELL / 2} y={CELL / 2 + 5} textAnchor="middle" className="viz-cell-value">
                  {value}
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

export default function CowSnapshotViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
