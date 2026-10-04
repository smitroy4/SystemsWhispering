import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface ActiveCell {
  bucket: number;
  pos: number;
}

interface SetState {
  buckets: number[][];
  compared: ActiveCell[];
  hot: ActiveCell | null;
  landed: number;
  rejected: boolean;
}

function frame(
  id: string,
  description: string,
  buckets: number[][],
  landed: number,
  compared: ActiveCell[] = [],
  hot: ActiveCell | null = null,
  rejected = false,
): VizStep {
  return {
    id,
    description,
    state: { buckets, compared, hot, landed, rejected } satisfies SetState,
    highlight: [landed],
  };
}

const CAP = 5;

/** add 7, add 3, re-add 7 (rejected), contains 12 (miss), add 12. */
function buildSteps(): VizStep[] {
  const empty: number[][] = [[], [], [], [], []];
  return [
    frame('start', 'Start: empty set of 5 buckets. add returns true only for NEW keys.', empty, -1),
    frame('add-7', 'add(7): 7 % 5 = 2. New key — stored, returns true.', [[], [], [7], [], []], 2, [], { bucket: 2, pos: 0 }),
    frame('add-3', 'add(3): 3 % 5 = 3. New key — stored, returns true.', [[], [], [7], [3], []], 3, [], { bucket: 3, pos: 0 }),
    frame(
      'add-7-again',
      'add(7) again: hash to bucket 2, compare 7 — EQUAL. Duplicate rejected, set unchanged, returns false.',
      [[], [], [7], [3], []],
      2,
      [{ bucket: 2, pos: 0 }],
      null,
      true,
    ),
    frame(
      'contains-12',
      'contains(12): 12 % 5 = 2. Compare 7 — not equal, chain ends. Returns false.',
      [[], [], [7], [3], []],
      2,
      [{ bucket: 2, pos: 0 }],
    ),
    frame(
      'add-12',
      'add(12): same bucket, no match — chained behind 7, returns true.',
      [[], [], [7, 12], [3], []],
      2,
      [{ bucket: 2, pos: 0 }],
      { bucket: 2, pos: 1 },
    ),
    frame(
      'done',
      'Done: set = {7, 3, 12}. Membership tests cost one hash + a short chain walk: O(1) average.',
      [[], [], [7, 12], [3], []],
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

function toneFor(state: SetState, bucket: number, pos: number): CellTone {
  if (state.hot !== null && state.hot.bucket === bucket && state.hot.pos === pos) return 'swapped';
  if (state.compared.some((c) => c.bucket === bucket && c.pos === pos)) {
    return state.rejected ? 'swapped' : 'compared';
  }
  return 'default';
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SetState;
  const maxChain = Math.max(1, ...state.buckets.map((b) => b.length));
  const width = CHAIN_X0 + maxChain * CHAIN_GAP + 20;
  const height = TOP * 2 + CAP * ROW_H - 18;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Hash set with ${CAP} buckets`}
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
              const tone = toneFor(state, b, pos);
              return (
                <g key={pos}>
                  <VizEdge
                    x1={pos === 0 ? BUCKET_X + 26 : cx - CHAIN_GAP}
                    y1={y}
                    x2={cx}
                    y2={y}
                    trim={pos === 0 ? 2 : RADIUS + 2}
                    tone={tone === 'default' ? 'default' : 'active'}
                  />
                  <VizNode x={cx} y={y} value={key} tone={tone} radius={RADIUS} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function HashSetViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
