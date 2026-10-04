import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface ActiveCell {
  bucket: number;
  /** Position inside the chain; -1 means the bucket box itself. */
  pos: number;
}

interface HashState {
  buckets: number[][];
  /** Chain nodes highlighted as traversed/compared. */
  compared: ActiveCell[];
  /** The node just inserted or found. */
  hot: ActiveCell | null;
  /** The bucket the hash just landed in. */
  landed: number;
}

function frame(
  id: string,
  description: string,
  buckets: number[][],
  landed: number,
  compared: ActiveCell[] = [],
  hot: ActiveCell | null = null,
): VizStep {
  return {
    id,
    description,
    state: { buckets, compared, hot, landed } satisfies HashState,
    highlight: [landed],
  };
}

const CAP = 5;

/** put 7, 12 (collision), 3, 22 (long chain), then get 22. */
function buildSteps(): VizStep[] {
  const empty: number[][] = [[], [], [], [], []];
  return [
    frame('start', 'Start: 5 empty buckets. Demo hash: index = key % 5.', empty, -1),
    frame('put-7', 'put(7): 7 % 5 = 2. Bucket 2 is empty — 7 becomes its head.', [[], [], [7], [], []], 2, [], { bucket: 2, pos: 0 }),
    frame(
      'put-12',
      'put(12): 12 % 5 = 2 — COLLISION. Walk past 7 (not equal), chain 12 behind it.',
      [[], [], [7, 12], [], []],
      2,
      [{ bucket: 2, pos: 0 }],
      { bucket: 2, pos: 1 },
    ),
    frame('put-3', 'put(3): 3 % 5 = 3. A free bucket — no walking needed.', [[], [], [7, 12], [3], []], 3, [], { bucket: 3, pos: 0 }),
    frame(
      'put-22',
      'put(22): 22 % 5 = 2 again. Compare past 7, past 12, then chain 22 at the end.',
      [[], [], [7, 12, 22], [3], []],
      2,
      [
        { bucket: 2, pos: 0 },
        { bucket: 2, pos: 1 },
      ],
      { bucket: 2, pos: 2 },
    ),
    frame(
      'get-22',
      'get(22): hash to bucket 2, compare 7 ✗, compare 12 ✗, match 22 ✓. Chain length rules lookup cost.',
      [[], [], [7, 12, 22], [3], []],
      2,
      [
        { bucket: 2, pos: 0 },
        { bucket: 2, pos: 1 },
      ],
      { bucket: 2, pos: 2 },
    ),
    frame(
      'done',
      'Done. Good hashes keep chains short: O(1) average. Bad hashes pile up: O(n) worst case.',
      [[], [], [7, 12, 22], [3], []],
      -1,
    ),
  ];
}

const ROW_H = 62;
const TOP = 34;
const BUCKET_X = 64;
const CHAIN_X0 = 190;
const CHAIN_GAP = 76;
const RADIUS = 17;

function toneFor(state: HashState, bucket: number, pos: number): CellTone {
  if (state.hot !== null && state.hot.bucket === bucket && state.hot.pos === pos) return 'swapped';
  if (state.compared.some((c) => c.bucket === bucket && c.pos === pos)) return 'compared';
  return 'default';
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as HashState;
  const maxChain = Math.max(1, ...state.buckets.map((b) => b.length));
  const width = CHAIN_X0 + maxChain * CHAIN_GAP + 20;
  const height = TOP * 2 + CAP * ROW_H - 18;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Hash table with ${CAP} buckets`}
    >
      {state.buckets.map((chain, b) => {
        const y = TOP + b * ROW_H;
        const bucketTone: CellTone = state.landed === b ? 'active' : 'default';
        return (
          <g key={b}>
            <text x={BUCKET_X - 44} y={y + 5} textAnchor="middle" className="viz-cell-index">
              {b}
            </text>
            <g
              className={`viz-anim viz-cell viz-tone-${bucketTone}`}
              style={{ transform: `translate(${BUCKET_X - 26}px, ${y - 20}px)` }}
            >
              <rect width={52} height={40} rx={8} />
              <text x={26} y={25} textAnchor="middle" className="viz-cell-value">
                {chain.length === 0 ? '·' : chain.length}
              </text>
            </g>
            {chain.map((key, pos) => {
              const cx = CHAIN_X0 + pos * CHAIN_GAP;
              return (
                <g key={pos}>
                  <VizEdge
                    x1={pos === 0 ? BUCKET_X + 26 : cx - CHAIN_GAP}
                    y1={y}
                    x2={cx}
                    y2={y}
                    trim={pos === 0 ? 2 : RADIUS + 2}
                    tone={toneFor(state, b, pos) === 'default' ? 'default' : 'active'}
                  />
                  <VizNode x={cx} y={y} value={key} tone={toneFor(state, b, pos)} radius={RADIUS} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function HashViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
