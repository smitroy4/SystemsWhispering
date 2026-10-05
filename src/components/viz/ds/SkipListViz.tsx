import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SkipHop {
  level: number;
  from: number;
  to: number;
}

interface SkipState {
  values: number[];
  /** Tower height per value index. */
  height: number[];
  levels: number;
  tones: CellTone[][];
  hops: SkipHop[];
}

function frame(
  id: string,
  description: string,
  values: number[],
  height: number[],
  levels: number,
  tones: CellTone[][],
  hops: SkipHop[] = [],
): VizStep {
  return {
    id,
    description,
    state: { values, height, levels, tones, hops } satisfies SkipState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function blankTones(levels: number, n: number): CellTone[][] {
  return Array.from({ length: levels }, () => Array.from({ length: n }, () => D));
}

/** Search 19 down the lanes, then insert 13 with a coin-flip tower. */
function buildSteps(): VizStep[] {
  const values = [3, 7, 12, 19, 25];
  const height = [2, 1, 3, 1, 2];
  const levels = 3;

  const t0 = blankTones(levels, values.length);

  const tSearch = blankTones(levels, values.length);
  tSearch[2][2] = C; // 12 visited on L2
  tSearch[1][2] = C; // 12 revisited on L1
  tSearch[0][2] = C;
  tSearch[0][3] = A; // 19 found on L0

  const tInsert = blankTones(levels, values.length);
  tInsert[1][2] = A; // predecessor on L1
  tInsert[0][2] = A; // predecessor on L0

  const values2 = [3, 7, 12, 13, 19, 25];
  const height2 = [2, 1, 3, 2, 1, 2];
  const tSpliced = blankTones(levels, values2.length);
  tSpliced[1][3] = S;
  tSpliced[0][3] = S;

  return [
    frame('start', 'Start: sorted towers. Level 2 is the express lane — only 12 rides it.', values, height, levels, t0),
    frame('search-l2', 'Search 19: top lane — 12 < 19, scoot right. Nothing beyond: drop down.', values, height, levels, tSearch, [{ level: 2, from: -1, to: 2 }]),
    frame('search-l1', 'Lane 1 from 12: next is 25 > 19 — stop. Drop to the local lane.', values, height, levels, tSearch, [{ level: 1, from: 2, to: 4 }]),
    frame('search-l0', 'Lane 0 from 12: next is 19 — found in a handful of hops, not n steps.', values, height, levels, tSearch, [{ level: 0, from: 2, to: 3 }]),
    frame('insert-walk', 'Insert 13: same walk, but record predecessors — L1: 12, L0: 12.', values, height, levels, tInsert),
    frame('coin', 'Coin flips: heads → grow to lane 1, tails → stop. Tower height 2, decided by luck.', values, height, levels, tInsert),
    frame('splice', 'Splice 13 after 12 on lanes 0–1. No rotations, no fix-ups — the coin balanced it.', values2, height2, levels, tSpliced),
    frame('done', 'Done: expected O(log n) everything — lanes do the work rotations used to do.', values2, height2, levels, blankTones(levels, values2.length).map((row) => row.map(() => DONE))),
  ];
}

const BOX_W = 46;
const BOX_H = 38;
const X_GAP = 30;
const ROW_H = 74;
const TOP = 40;
const R = 17;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SkipState;
  const n = state.values.length;
  const width = 120 + n * (BOX_W + X_GAP);
  const height = TOP * 2 + state.levels * ROW_H;
  const xs = state.values.map((_, i) => 120 + i * (BOX_W + X_GAP));
  const yOf = (level: number) => TOP + (state.levels - 1 - level) * ROW_H + BOX_H / 2;
  const covers = (i: number, level: number) => state.height[i] > level;

  const hopActive = (level: number, from: number, to: number) =>
    state.hops.some((h) => h.level === level && h.from === from && h.to === to);

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Skip list with ${n} towers and ${state.levels} lanes`}
    >
      {Array.from({ length: state.levels }, (_, level) => (
        <text
          key={`lbl${level}`}
          x={88}
          y={yOf(level) + 5}
          textAnchor="end"
          className="viz-pointer-label"
        >
          L{level}
        </text>
      ))}
      {Array.from({ length: state.levels }, (_, level) => {
        const present = state.values.map((_, i) => i).filter((i) => covers(i, level));
        return (
          <g key={`row${level}`}>
            {present.slice(0, -1).map((i, k) => {
              const j = present[k + 1];
              return (
                <VizEdge
                  key={`e${level}-${i}-${j}`}
                  x1={xs[i]}
                  y1={yOf(level)}
                  x2={xs[j]}
                  y2={yOf(level)}
                  trim={R + 2}
                  tone={hopActive(level, i, j) || hopActive(level, -1, j) ? 'active' : 'default'}
                />
              );
            })}
          </g>
        );
      })}
      {state.values.map((value, i) =>
        Array.from({ length: state.levels }, (_, level) => {
          if (!covers(i, level)) return null;
          return (
            <g key={`v${level}-${i}`}>
              {level > 0 && covers(i, level - 1) ? (
                <VizEdge
                  x1={xs[i]}
                  y1={yOf(level)}
                  x2={xs[i]}
                  y2={yOf(level - 1)}
                  trim={R + 2}
                  tone="default"
                />
              ) : null}
              <VizNode
                x={xs[i]}
                y={yOf(level)}
                value={value}
                tone={state.tones[level]?.[i] ?? 'default'}
                radius={R}
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}

export default function SkipListViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
