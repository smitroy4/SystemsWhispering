import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface HashBucketsState {
  buckets: string[][];
  tones: CellTone[][];
  status: string;
}

function frame(
  id: string,
  description: string,
  buckets: string[][],
  tones: CellTone[][],
  status: string,
): VizStep {
  return { id, description, state: { buckets, tones, status } satisfies HashBucketsState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function emptyBuckets(n: number): string[][] {
  return Array.from({ length: n }, () => []);
}

function toneGrid(buckets: string[][], on: Array<[number, number]>, tone: CellTone): CellTone[][] {
  return buckets.map((chain, b) => chain.map((_, i) => (on.some(([bb, ii]) => bb === b && ii === i) ? tone : D)));
}

/** Collide in bucket 2, walk the chain, cross threshold, double the table. */
function buildSteps(): VizStep[] {
  const b0 = emptyBuckets(8);
  const b1 = emptyBuckets(8);
  b1[2] = ['ash'];
  const b2 = emptyBuckets(8);
  b2[2] = ['ash', 'birch'];
  const b3 = emptyBuckets(8);
  b3[2] = ['ash', 'birch'];
  b3[5] = ['cedar'];
  const big = emptyBuckets(16);
  big[2] = ['ash'];
  big[5] = ['cedar'];
  big[10] = ['birch'];
  big[0] = ['elm'];
  big[1] = ['fig'];
  big[7] = ['oak'];
  big[9] = ['pine'];

  return [
    frame('start', 'Start: 8 buckets, threshold 6 (8 × 0.75). Index = (8 − 1) & spread(hash).', b0, toneGrid(b0, [], D), 'size = 0 · threshold = 6'),
    frame('put-ash', 'put("ash"): spread hash lands in bucket 2 — first entry, no chain.', b1, toneGrid(b1, [[2, 0]], S), 'size = 1 · "ash" → b2'),
    frame('collide', 'put("birch"): SAME bucket 2 — a collision. Chains: new head, old head linked.', b2, toneGrid(b2, [[2, 0]], S), 'size = 2 · b2 = [birch → ash]'),
    frame('get', 'get("birch"): hash → b2, walk the chain comparing equals — second node matches.', b2, toneGrid(b2, [[2, 0]], C), 'get("birch") walks 2 nodes'),
    frame('fill', 'More puts: cedar → b5. At size 6 the threshold trips — next put doubles the table.', b3, toneGrid(b3, [[5, 0]], S), 'size = 6 · threshold reached'),
    frame('resize', 'Resize 8 → 16: each entry stays or jumps +8 by one hash bit. birch moves b2 → b10.', big, toneGrid(big, [[10, 0]], A), 'size = 7 · capacity = 16'),
    frame('done', 'Done: short chains, spread hashes, double on 0.75 — average O(1) by construction.', big, big.map((chain) => chain.map(() => DONE)), 'size = 7 · threshold = 12'),
  ];
}

const PAD = 16;
const ROW_H = 36;
const LABEL_W = 44;
const CHIP_W = 64;
const CHIP_GAP = 22;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as HashBucketsState;
  const maxChain = Math.max(1, ...state.buckets.map((c) => c.length));
  const width = PAD * 2 + LABEL_W + maxChain * CHIP_W + Math.max(0, maxChain - 1) * CHIP_GAP;
  const height = PAD * 2 + state.buckets.length * ROW_H;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Hash table with ${state.buckets.length} buckets`}
      >
        {state.buckets.map((chain, b) => (
          <g key={b}>
            <text
              x={PAD + LABEL_W - 8}
              y={PAD + b * ROW_H + ROW_H / 2 + 5}
              textAnchor="end"
              className="viz-pointer-label"
            >
              b{b}
            </text>
            {chain.length === 0 ? (
              <text x={PAD + LABEL_W + 6} y={PAD + b * ROW_H + ROW_H / 2 + 5} className="viz-edge-label">
                —
              </text>
            ) : null}
            {chain.map((key, i) => {
              const x = PAD + LABEL_W + i * (CHIP_W + CHIP_GAP);
              const y = PAD + b * ROW_H + 4;
              return (
                <g key={`${b}-${i}`}>
                  {i > 0 ? (
                    <line
                      x1={x - CHIP_GAP + 4}
                      y1={y + 14}
                      x2={x - 4}
                      y2={y + 14}
                      stroke="var(--viz-muted-ink)"
                      strokeWidth={2}
                    />
                  ) : null}
                  <g
                    className={`viz-anim viz-cell viz-tone-${state.tones[b]?.[i] ?? 'default'}`}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <rect width={CHIP_W} height={28} rx={7} />
                    <text x={CHIP_W / 2} y={19} textAnchor="middle" className="viz-cell-value" fontSize={13}>
                      {key}
                    </text>
                  </g>
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

export default function HashMapBucketsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
