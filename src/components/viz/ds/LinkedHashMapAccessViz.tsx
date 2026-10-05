import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface LinkedOrderState {
  /** Keys head (evict first) → tail (most recent). */
  order: number[];
  tones: CellTone[];
  evicted: number | null;
  status: string;
}

function frame(
  id: string,
  description: string,
  order: number[],
  tones: CellTone[],
  evicted: number | null,
  status: string,
): VizStep {
  return { id, description, state: { order, tones, evicted, status } satisfies LinkedOrderState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Access order with removeEldestEntry: hits bubble, the head gets evicted. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: access-order map, empty. Iteration will follow this list, not the buckets.', [], [], null, 'order = []'),
    frame('put-123', 'put 1, 2, 3: appends in arrival order. So far insertion == access order.', [1, 2, 3], toneRow(3, [2], S), null, 'order = [1, 2, 3]'),
    frame('get-1', 'get(1): HIT — unlink 1, splice at the tail. The head (2) is now the victim.', [2, 3, 1], toneRow(3, [2], C), null, 'get(1) → order = [2, 3, 1]'),
    frame('put-4', 'put(4): size 4 > capacity 3 — removeEldestEntry drops the head (2).', [3, 1, 4], toneRow(3, [2], S), 2, 'evicted 2 → order = [3, 1, 4]'),
    frame('get-3', 'get(3): bubbles to the tail. Recency IS the list order — no timestamps stored.', [1, 4, 3], toneRow(3, [2], C), null, 'get(3) → order = [1, 4, 3]'),
    frame('done', 'Done: O(1) hits, O(1) eviction — five lines of LinkedHashMap, zero timers.', [1, 4, 3], toneRow(3, [], D).map(() => DONE), null, 'LRU without a clock'),
  ];
}

const NODE_GAP = 110;
const NODE_Y = 84;
const RADIUS = 24;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as LinkedOrderState;
  const xs = state.order.map((_, i) => 70 + i * NODE_GAP);
  const width = Math.max(320, 70 * 2 + Math.max(0, state.order.length - 1) * NODE_GAP + 60);
  const height = 190;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Access order with ${state.order.length} entries, least recent first`}
      >
        {xs.length > 0 ? (
          <ArrowLabel x={xs[0]} y={NODE_Y - RADIUS - 12} label="evict first" direction="down" />
        ) : null}
        {xs.length > 0 ? (
          <ArrowLabel x={xs[xs.length - 1]} y={NODE_Y - RADIUS - 12} label="most recent" direction="down" />
        ) : null}
        {state.order.map((key, i) => (
          <VizNode
            key={key}
            x={xs[i]}
            y={NODE_Y}
            value={`k${key}`}
            tone={state.tones[i] ?? 'default'}
            radius={RADIUS}
          />
        ))}
        {state.order.slice(0, -1).map((_, i) => (
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
        <text x={width / 2} y={NODE_Y + RADIUS + 34} textAnchor="middle" className="viz-edge-label">
          {state.evicted !== null ? `removeEldestEntry evicted key ${state.evicted}` : 'iteration follows this list, not the buckets'}
        </text>
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function LinkedHashMapAccessViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
