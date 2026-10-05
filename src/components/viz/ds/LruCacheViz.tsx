import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface LruState {
  /** Keys front (MRU) → back (LRU). */
  order: number[];
  values: Record<number, number>;
  tones: CellTone[];
  evicted: number | null;
  status: string;
}

function frame(
  id: string,
  description: string,
  order: number[],
  values: Record<number, number>,
  tones: CellTone[],
  evicted: number | null,
  status: string,
): VizStep {
  return { id, description, state: { order, values, tones, evicted, status } satisfies LruState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Capacity 2: fill, hit-reorder, overflow eviction, miss. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: capacity 2, empty map, empty list. Every op will cost O(1).', [], {}, [], null, 'map = {}'),
    frame('put-1', 'put(1, 10): new node to the front; map 1 → node.', [1], { 1: 10 }, [S], null, 'map = {1}'),
    frame('put-2', 'put(2, 20): front again. Back of the list = eviction candidate.', [2, 1], { 1: 10, 2: 20 }, [S, D], null, 'map = {1, 2}'),
    frame('get-1', 'get(1): HIT — map finds it, unlink + front-insert. 1 is safe now.', [1, 2], { 1: 10, 2: 20 }, [S, D], null, 'get(1) = 10'),
    frame('put-3', 'put(3, 30): full — evict the back (key 2), reuse for 3 at the front.', [3, 1], { 1: 10, 3: 30 }, [S, D], 2, 'evicted key 2'),
    frame('get-2', 'get(2): MISS — map has no 2. Returns -1, touches nothing.', [3, 1], { 1: 10, 3: 30 }, [D, D], null, 'get(2) = -1'),
    frame('done', 'Done: recency is the list order, lookup is the map — O(1) both.', [3, 1], { 1: 10, 3: 30 }, [DONE, DONE], null, 'map = {1, 3}'),
  ];
}

const NODE_GAP = 120;
const NODE_Y = 84;
const RADIUS = 26;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as LruState;
  const xs = state.order.map((_, i) => 70 + i * NODE_GAP);
  const width = Math.max(300, 70 * 2 + Math.max(0, state.order.length - 1) * NODE_GAP + 60);
  const height = 190;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`LRU list with ${state.order.length} entries, most recent first`}
      >
        {xs.length > 0 ? (
          <ArrowLabel x={xs[0]} y={NODE_Y - RADIUS - 12} label="MRU" direction="down" />
        ) : null}
        {xs.length > 0 ? (
          <ArrowLabel x={xs[xs.length - 1]} y={NODE_Y - RADIUS - 12} label="LRU" direction="down" />
        ) : null}
        {state.order.map((key, i) => (
          <VizNode
            key={key}
            x={xs[i]}
            y={NODE_Y}
            value={`${key}=${state.values[key]}`}
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
        {state.evicted !== null ? (
          <text x={width / 2} y={NODE_Y + RADIUS + 34} textAnchor="middle" className="viz-edge-label">
            {`evicted key ${state.evicted}`}
          </text>
        ) : (
          <text x={width / 2} y={NODE_Y + RADIUS + 34} textAnchor="middle" className="viz-edge-label">
            capacity 2 · back of the list is evicted first
          </text>
        )}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function LruCacheViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
