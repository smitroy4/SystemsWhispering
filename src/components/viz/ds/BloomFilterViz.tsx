import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BloomState {
  bits: number[];
  tones: CellTone[];
  /** Positions probed by the current operation. */
  probes: number[];
  verdict: string;
}

const M = 16;

function frame(
  id: string,
  description: string,
  bits: number[],
  tones: CellTone[],
  probes: number[],
  verdict: string,
): VizStep {
  return { id, description, state: { bits, tones, probes, verdict } satisfies BloomState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function zeros(): number[] {
  return Array.from({ length: M }, () => 0);
}

function withBits(...positions: number[]): number[] {
  const bits = zeros();
  for (const p of positions) bits[p] = 1;
  return bits;
}

function toneRow(on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: M }, (_, i) => (on.includes(i) ? tone : D));
}

/** Add apple + mango, then query apple (hit), fig (miss), cherry (false positive). */
function buildSteps(): VizStep[] {
  // apple → {2, 7, 12}; mango → {1, 7, 15}; fig → {0, 9, 5}; cherry → {2, 7, 15}.
  const afterApple = withBits(2, 7, 12);
  const afterMango = withBits(1, 2, 7, 12, 15);
  return [
    frame('start', 'Start: 16 bits, k = 3 hashes. Empty filter knows nothing — every query says absent.', zeros(), toneRow([], D), [], 'query anything → definitely absent'),
    frame('add-apple', 'add("apple"): hashes point at 2, 7, 12 — three bits flip on.', afterApple, toneRow([2, 7, 12], S), [2, 7, 12], 'added "apple"'),
    frame('add-mango', 'add("mango"): positions 1, 7, 15. Bit 7 was already on — sharing is normal.', afterMango, toneRow([1, 15], S), [1, 7, 15], 'added "mango"'),
    frame('query-apple', 'query("apple"): 2, 7, 12 all set → MAYBE present. Correct — it was added.', afterMango, toneRow([2, 7, 12], C), [2, 7, 12], '"apple" → maybe (true positive)'),
    frame('query-fig', 'query("fig"): position 0 is CLEAR → DEFINITELY absent. One zero decides.', afterMango, toneRow([0], A), [0, 5, 9], '"fig" → definitely absent'),
    frame('query-cherry', 'query("cherry"): 2, 7, 15 ALL set — yet cherry was never added. FALSE POSITIVE.', afterMango, toneRow([2, 7, 15], S), [2, 7, 15], '"cherry" → maybe (FALSE positive)'),
    frame('done', 'Done: no false negatives ever — false positives tuned by m and k, verified at the source of truth.', afterMango, toneRow([1, 2, 7, 12, 15], DONE), [], 'size the bits, then verify hits'),
  ];
}

const CELL = 30;
const GAP = 4;
const PAD = 16;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BloomState;
  const width = PAD * 2 + M * CELL + (M - 1) * GAP;
  const height = PAD * 2 + 30 + CELL + 30;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Bloom filter with ${M} bits`}
      >
        {state.probes.map((p) => (
          <ArrowLabel
            key={p}
            x={PAD + p * (CELL + GAP) + CELL / 2}
            y={PAD + 22}
            label={`h${state.probes.indexOf(p) + 1}`}
            direction="down"
          />
        ))}
        {state.bits.map((bit, i) => {
          const x = PAD + i * (CELL + GAP);
          const y = PAD + 30;
          return (
            <g
              key={i}
              className={`viz-anim viz-cell viz-tone-${state.tones[i] ?? 'default'}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <rect width={CELL} height={CELL} rx={7} />
              <text x={CELL / 2} y={CELL / 2 + 5} textAnchor="middle" className="viz-cell-value">
                {bit}
              </text>
              <text x={CELL / 2} y={CELL + 13} textAnchor="middle" className="viz-cell-index">
                {i}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="viz-statusline">{state.verdict}</p>
    </>
  );
}

export default function BloomFilterViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
