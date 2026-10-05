import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface ChmState {
  buckets: string[][];
  tones: CellTone[][];
  locks: boolean[];
  status: string;
}

function frame(
  id: string,
  description: string,
  buckets: string[][],
  tones: CellTone[][],
  locks: boolean[],
  status: string,
): VizStep {
  return { id, description, state: { buckets, tones, locks, status } satisfies ChmState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function empty(): string[][] {
  return Array.from({ length: 8 }, () => []);
}

function toneGrid(buckets: string[][], on: Array<[number, number]>, tone: CellTone): CellTone[][] {
  return buckets.map((chain, b) => chain.map((_, i) => (on.some(([bb, ii]) => bb === b && ii === i) ? tone : D)));
}

function noLocks(): boolean[] {
  return Array.from({ length: 8 }, () => false);
}

/** Parallel bins, lock-free reads, one atomic compound. */
function buildSteps(): VizStep[] {
  const e = empty();
  const b = empty();
  b[2] = ['a'];
  b[5] = ['f'];
  const locksBoth = noLocks();
  locksBoth[2] = true;
  locksBoth[5] = true;

  return [
    frame('start', 'Start: 8 bins, no segments since Java 8 — each bin head is its own lock.', e, toneGrid(e, [], D), noLocks(), 'locks held: none'),
    frame('parallel', 'T1 put(a) → b2 AND T2 put(f) → b5 at once. Different bins: zero contention.', b, toneGrid(b, [[2, 0], [5, 0]], S), locksBoth, 'locks held: b2, b5 — in parallel'),
    frame('read', 'get(a): volatile read of b2 — no lock taken, always current. Readers never wait.', b, toneGrid(b, [[2, 0]], C), noLocks(), 'get(a) lock-free → "a"'),
    frame('compound', 'merge(k) on b2: bins lock briefly for the whole compound — atomic, no check-then-act hole.', b, toneGrid(b, [[2, 0]], A), [false, false, true, false, false, false, false, false], 'merge holds b2 only'),
    frame('done', 'Done: fine-grained bins + CAS empties + cooperative resize — throughput scales with threads.', b, b.map((chain) => chain.map(() => DONE)), noLocks(), 'locks held: none — work done'),
  ];
}

const PAD = 16;
const ROW_H = 34;
const LABEL_W = 44;
const CHIP_W = 48;
const LOCK_W = 46;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as ChmState;
  const maxChain = Math.max(1, ...state.buckets.map((c) => c.length));
  const width = PAD * 2 + LABEL_W + maxChain * (CHIP_W + 8) + LOCK_W + 20;
  const height = PAD * 2 + state.buckets.length * ROW_H;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="ConcurrentHashMap bins with per-bin locks"
      >
        {state.buckets.map((chain, bin) => {
          const y = PAD + bin * ROW_H + 6;
          return (
            <g key={bin}>
              <text
                x={PAD + LABEL_W - 8}
                y={PAD + bin * ROW_H + ROW_H / 2 + 5}
                textAnchor="end"
                className="viz-pointer-label"
              >
                b{bin}
              </text>
              {chain.length === 0 ? (
                <text x={PAD + LABEL_W + 6} y={PAD + bin * ROW_H + ROW_H / 2 + 5} className="viz-edge-label">
                  —
                </text>
              ) : null}
              {chain.map((key, i) => (
                <g
                  key={`${bin}-${i}`}
                  className={`viz-anim viz-cell viz-tone-${state.tones[bin]?.[i] ?? 'default'}`}
                  style={{ transform: `translate(${PAD + LABEL_W + i * (CHIP_W + 8)}px, ${y}px)` }}
                >
                  <rect width={CHIP_W} height={26} rx={7} />
                  <text x={CHIP_W / 2} y={18} textAnchor="middle" className="viz-cell-value" fontSize={13}>
                    {key}
                  </text>
                </g>
              ))}
              <text
                x={PAD + LABEL_W + maxChain * (CHIP_W + 8) + 10}
                y={PAD + bin * ROW_H + ROW_H / 2 + 5}
                textAnchor="start"
                className={state.locks[bin] ? 'viz-pointer-label' : 'viz-edge-label'}
              >
                {state.locks[bin] ? 'locked' : '·'}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function ChmSegmentsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
