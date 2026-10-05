import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface PipelineState {
  labels: string[];
  rows: number[][];
  tones: CellTone[][];
  status: string;
}

function frame(
  id: string,
  description: string,
  labels: string[],
  rows: number[][],
  tones: CellTone[][],
  status: string,
): VizStep {
  return { id, description, state: { labels, rows, tones, status } satisfies PipelineState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Evens of [3,1,4,1,5], times ten, summed — one element at a time. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: source [3, 1, 4, 1, 5]. Nothing flows until a terminal op fires.', ['source'], [[3, 1, 4, 1, 5]], [toneRow(5, [], D)], 'lazy — no work yet'),
    frame('filter', 'filter(even): 4 passes, the rest are dropped mid-flight — no intermediate list.', ['source', 'filter(even)'], [[3, 1, 4, 1, 5], [4]], [toneRow(5, [2], S), toneRow(1, [0], S)], 'kept = [4]'),
    frame('map', 'map(×10): the survivor transforms to 40. Stages fuse — still one pass.', ['source', 'filter(even)', 'map(×10)'], [[3, 1, 4, 1, 5], [4], [40]], [toneRow(5, [], D), toneRow(1, [], D), toneRow(1, [0], S)], 'mapped = [40]'),
    frame('terminal', 'sum(): the terminal fires the pipeline — 40. findFirst would have stopped even earlier.', ['source', 'filter(even)', 'map(×10)'], [[3, 1, 4, 1, 5], [4], [40]], [toneRow(5, [], D), toneRow(1, [], D), toneRow(1, [0], C)], 'sum = 40'),
    frame('done', 'Done: filter → map → sum in one lazy pass — pipelines over loops when stages multiply.', ['source', 'filter(even)', 'map(×10)'], [[3, 1, 4, 1, 5], [4], [40]], [toneRow(5, [], D), toneRow(1, [0], DONE), toneRow(1, [0], DONE)], 'single-use pipeline, spent'),
  ];
}

const CELL = 44;
const GAP = 8;
const PAD = 16;
const LABEL_W = 110;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as PipelineState;
  const maxCols = Math.max(...state.rows.map((r) => r.length));
  const width = PAD * 2 + LABEL_W + maxCols * CELL + Math.max(0, maxCols - 1) * GAP;
  const height = PAD * 2 + state.rows.length * (CELL + 20) + Math.max(0, state.rows.length - 1) * 10;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Stream pipeline with three stages"
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

export default function StreamsPipelineViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
