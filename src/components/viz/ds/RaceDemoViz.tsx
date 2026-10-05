import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface RaceState {
  buckets: string[][];
  tones: CellTone[][];
  actor: string;
  status: string;
}

function frame(
  id: string,
  description: string,
  buckets: string[][],
  tones: CellTone[][],
  actor: string,
  status: string,
): VizStep {
  return { id, description, state: { buckets, tones, actor, status } satisfies RaceState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function empty(): string[][] {
  return [[], [], [], []];
}

function toneGrid(buckets: string[][], on: Array<[number, number]>, tone: CellTone): CellTone[][] {
  return buckets.map((chain, b) => chain.map((_, i) => (on.some(([bb, ii]) => bb === b && ii === i) ? tone : D)));
}

/** Two writers collide on bucket 1: HashMap loses one, CHM keeps both. */
function buildSteps(): VizStep[] {
  const e = empty();
  const t1 = empty();
  t1[1] = ['k1'];
  const lost = empty();
  lost[1] = ['k5'];
  const kept = empty();
  kept[1] = ['k1', 'k5'];

  return [
    frame('start', 'Start: 4 buckets, two writers, distinct keys. Sharing looks harmless.', e, toneGrid(e, [], D), '—', 'T1 → put(k1) · T2 → put(k5)'),
    frame('t1', 'T1 reads head of b1 (empty) and links k1. Not yet visible to T2’s stale read.', t1, toneGrid(t1, [[1, 0]], S), 'T1', 'T1 linked k1 → b1'),
    frame('lost', 'T2 ALSO read empty b1, links k5 over it — k1 silently lost. No exception, just gone.', lost, toneGrid(lost, [[1, 0]], A), 'T2', 'k1 LOST — size 1, should be 2'),
    frame('chm', 'ConcurrentHashMap: T2 waits on b1’s bin lock, then chains k5 behind k1. Both survive.', kept, toneGrid(kept, [[1, 1]], S), 'T2', 'bin lock serialized — size 2, correct'),
    frame('done', 'Done: distinct keys still race on structure — HashMap corrupts, CHM serializes per bin.', kept, kept.map((chain) => chain.map(() => DONE)), '—', 'corrupt vs correct: the lock made the difference'),
  ];
}

const PAD = 16;
const ROW_H = 40;
const LABEL_W = 44;
const CHIP_W = 56;
const CHIP_GAP = 22;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as RaceState;
  const maxChain = Math.max(1, ...state.buckets.map((c) => c.length));
  const width = PAD * 2 + LABEL_W + maxChain * CHIP_W + Math.max(0, maxChain - 1) * CHIP_GAP + 60;
  const height = PAD * 2 + state.buckets.length * ROW_H;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Two threads racing on one hash bucket"
      >
        {state.actor !== '—' ? (
          <text x={width - 8} y={PAD + 12} textAnchor="end" className="viz-pointer-label">
            {state.actor} writing
          </text>
        ) : null}
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
              const y = PAD + b * ROW_H + 6;
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

export default function RaceDemoViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
