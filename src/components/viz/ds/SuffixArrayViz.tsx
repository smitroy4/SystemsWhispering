import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SuffixRow {
  index: number;
  suffix: string;
}

interface SuffixState {
  rows: SuffixRow[];
  tones: CellTone[];
  status: string;
}

function frame(
  id: string,
  description: string,
  rows: SuffixRow[],
  tones: CellTone[],
  status: string,
): VizStep {
  return { id, description, state: { rows, tones, status } satisfies SuffixState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

const TEXT = 'banana';
function suffixesOf(order: number[]): SuffixRow[] {
  return order.map((index) => ({ index, suffix: TEXT.slice(index) }));
}

const UNSORTED = suffixesOf([0, 1, 2, 3, 4, 5]);
const SORTED = suffixesOf([5, 3, 1, 0, 4, 2]);

/** List suffixes, selection-sort the minima, then binary-search "ana". */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: "banana" has 6 suffixes — the index IS the structure under construction.', UNSORTED, [D, D, D, D, D, D], 'text = "banana"'),
    frame('min-a', 'Shortest first: "a" (index 5) is the minimum — swap it to the front.', suffixesOf([5, 1, 2, 3, 4, 0]), [S, D, D, D, D, C], 'SA[0] = 5'),
    frame('min-ana', 'Next minima: "ana" (3), then "anana" (1) — shared prefix "ana" decides.', suffixesOf([5, 3, 1, 2, 4, 0]), [DONE, S, S, C, D, D], 'SA[1..2] = 3, 1'),
    frame('sorted', 'Sorted: SA = [5, 3, 1, 0, 4, 2]. Occurrences of any pattern now sit together.', SORTED, [DONE, DONE, DONE, DONE, DONE, DONE], 'SA = [5, 3, 1, 0, 4, 2]'),
    frame('search', 'Search "ana": binary probe hits "anana" — match. Neighbours 3 and 1 both start with "ana".', SORTED, [D, A, S, D, D, D], 'occurrences at SA[1..2]'),
    frame('done', 'Done: O(m log n) search from sorting once — plus LCP for the shared-prefix detail.', SORTED, [DONE, DONE, DONE, DONE, DONE, DONE], 'count("ana") = 2'),
  ];
}

const PAD = 16;
const ROW_H = 34;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SuffixState;
  const width = 420;
  const height = PAD * 2 + state.rows.length * ROW_H;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Suffix array with ${state.rows.length} suffixes`}
      >
        {state.rows.map((row, i) => {
          const y = PAD + i * ROW_H;
          return (
            <g key={`${i}-${row.index}`}>
              <text x={PAD} y={y + 21} textAnchor="start" className="viz-pointer-label">
                {`SA[${i}] = ${row.index}`}
              </text>
              <g
                className={`viz-anim viz-cell viz-tone-${state.tones[i] ?? 'default'}`}
                style={{ transform: `translate(${150}px, ${y}px)` }}
              >
                <rect width={230} height={26} rx={7} />
                <text x={12} y={18} textAnchor="start" className="viz-cell-value" fontFamily="monospace">
                  {row.suffix}
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

export default function SuffixArrayViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
