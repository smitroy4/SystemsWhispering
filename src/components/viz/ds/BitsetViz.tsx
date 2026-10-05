import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BitsetState {
  labels: string[];
  rows: number[][];
  tones: CellTone[][];
  status: string;
}

const N = 16;

function frame(
  id: string,
  description: string,
  labels: string[],
  rows: number[][],
  tones: CellTone[][],
  status: string,
): VizStep {
  return { id, description, state: { labels, rows, tones, status } satisfies BitsetState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function zeros(): number[] {
  return Array.from({ length: N }, () => 0);
}

function toneRow(active: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: N }, (_, i) => (active.includes(i) ? tone : D));
}

/** Set, test, union word-parallel, count, clear. */
function buildSteps(): VizStep[] {
  const a0 = zeros();
  const a1 = zeros();
  a1[3] = 1;
  a1[10] = 1;
  const b = zeros();
  b[4] = 1;
  b[10] = 1;
  const union = zeros();
  union[3] = 1;
  union[4] = 1;
  union[10] = 1;
  const cleared = [...union];
  cleared[3] = 0;

  return [
    frame('start', 'Start: 16 flags, one machine word, all zero. Membership costs one bit.', ['A'], [a0], [toneRow([], D)], 'A = {}'),
    frame('set-3', 'set(3): word[0] |= 1L << 3. One OR, done.', ['A'], [a1], [toneRow([3], S)], 'A = {3, 10}'),
    frame('set-10', 'set(10) was already flipped here — both members live in the same word.', ['A'], [a1], [toneRow([10], S)], 'A = {3, 10}'),
    frame('get-hit', 'get(3): (word & mask) != 0 → true. One AND, O(1).', ['A'], [a1], [toneRow([3], C)], 'get(3) = true'),
    frame('get-miss', 'get(4): the bit is 0 → false. Absence is as cheap as presence.', ['A'], [a1], [toneRow([4], A)], 'get(4) = false'),
    frame('union', 'B = {4, 10} arrives. A |= B: one OR over one word — 64 members per instruction.', ['A', 'B'], [union, b], [toneRow([4], S), toneRow([4, 10], D)], 'A ∪ B = {3, 4, 10}'),
    frame('count', 'cardinality: bitCount sums the word in hardware → 3. No loop over members.', ['A', 'B'], [union, b], [toneRow([3, 4, 10], C), toneRow([], D)], '|A| = 3'),
    frame('clear', 'clear(3): word &= ~mask. Unsetting is as cheap as setting.', ['A', 'B'], [cleared, b], [toneRow([3], A), toneRow([], D)], 'A = {4, 10}'),
    frame('done', 'Done: 16 flags in 8 bytes — density plus word-parallel algebra.', ['A', 'B'], [cleared, b], [toneRow([4, 10], DONE), toneRow([], D)], 'A = {4, 10}'),
  ];
}

const CELL = 30;
const GAP = 4;
const PAD = 16;
const LABEL_W = 28;
const WORD_GAP = 14;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BitsetState;
  const width = PAD * 2 + LABEL_W + N * CELL + (N - 1) * GAP + WORD_GAP;
  const rowH = 44;
  const height = PAD * 2 + state.rows.length * rowH + Math.max(0, state.rows.length - 1) * 10;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Bitset with ${N} bits`}
      >
        {state.rows.map((row, r) => (
          <g key={r}>
            <text
              x={PAD + LABEL_W - 8}
              y={PAD + r * (rowH + 10) + rowH / 2 + 5}
              textAnchor="end"
              className="viz-pointer-label"
            >
              {state.labels[r]}
            </text>
            {row.map((bit, i) => {
              const x = PAD + LABEL_W + i * (CELL + GAP) + (i >= N / 2 ? WORD_GAP : 0);
              const y = PAD + r * (rowH + 10);
              return (
                <g
                  key={`${r}-${i}`}
                  className={`viz-anim viz-cell viz-tone-${state.tones[r]?.[i] ?? 'default'}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <rect width={CELL} height={CELL} rx={7} />
                  <text x={CELL / 2} y={CELL / 2 + 5} textAnchor="middle" className="viz-cell-value">
                    {bit}
                  </text>
                  <text x={CELL / 2} y={CELL + 12} textAnchor="middle" className="viz-cell-index">
                    {i}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function BitsetViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
