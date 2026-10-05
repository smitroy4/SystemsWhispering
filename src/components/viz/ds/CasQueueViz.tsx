import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface CasState {
  values: string[];
  tones: CellTone[];
  head: number;
  tail: number;
  status: string;
}

function frame(
  id: string,
  description: string,
  values: string[],
  tones: CellTone[],
  head: number,
  tail: number,
  status: string,
): VizStep {
  return { id, description, state: { values, tones, head, tail, status } satisfies CasState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Sentinel head, link-then-swing offers, head-swing poll — no locks. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: sentinel H, head = tail = H. Empty queue, zero locks held.', ['H'], toneRow(1, [], D), 0, 0, 'head=H tail=H'),
    frame('link-a', 'offer(A): CAS links A after H. Tail still lags at H — lagging tails are normal.', ['H', 'A'], toneRow(2, [1], S), 0, 0, 'linked A · tail lags'),
    frame('swing-a', 'Swing tail H → A via CAS. Two CAS steps per offer: link, then swing.', ['H', 'A'], toneRow(2, [1], S), 0, 1, 'head=H tail=A'),
    frame('offer-b', 'offer(B): link after A, swing tail → B. Losers of either CAS just retry.', ['H', 'A', 'B'], toneRow(3, [2], S), 0, 2, 'head=H tail=B'),
    frame('poll', 'poll(): read head H (sentinel, no item), CAS head → A, return A’s item.', ['H', 'A', 'B'], toneRow(3, [0, 1], C), 1, 2, 'head=A · returned A'),
    frame('done', 'Done: lagging tails, helping, retries — progress without a single lock.', ['H', 'A', 'B'], toneRow(3, [], D).map(() => DONE), 1, 2, 'lock-free FIFO'),
  ];
}

const NODE_GAP = 110;
const NODE_Y = 92;
const RADIUS = 22;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as CasState;
  const xs = state.values.map((_, i) => 70 + i * NODE_GAP);
  const width = Math.max(320, 70 * 2 + Math.max(0, state.values.length - 1) * NODE_GAP + 60);
  const height = 200;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Lock-free queue with ${state.values.length} nodes`}
      >
        {state.values.length > state.head ? (
          <ArrowLabel x={xs[state.head]} y={NODE_Y - RADIUS - 12} label="head" direction="down" />
        ) : null}
        {state.values.length > state.tail ? (
          <ArrowLabel x={xs[state.tail]} y={NODE_Y + RADIUS + 14} label="tail" direction="up" />
        ) : null}
        {state.values.map((value, i) => (
          <VizNode key={`${i}-${value}`} x={xs[i]} y={NODE_Y} value={value} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
        ))}
        {state.values.slice(0, -1).map((_, i) => (
          <VizEdge
            key={`e${i}`}
            x1={xs[i]}
            y1={NODE_Y}
            x2={xs[i + 1]}
            y2={NODE_Y}
            trim={RADIUS + 2}
            tone="default"
          />
        ))}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function CasQueueViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
