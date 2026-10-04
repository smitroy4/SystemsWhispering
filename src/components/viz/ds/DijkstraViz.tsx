import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface WN {
  id: string;
  x: number;
  y: number;
}

interface WE {
  u: number;
  v: number;
  w: number;
}

interface DijkstraState {
  nodes: WN[];
  edges: WE[];
  /** Best-known distances; null = infinity. */
  dist: Array<number | null>;
  settled: boolean[];
  current: number;
}

function frame(
  id: string,
  description: string,
  dist: Array<number | null>,
  settled: boolean[],
  current: number,
): VizStep {
  return {
    id,
    description,
    state: {
      nodes: [
        { id: 'A', x: 60, y: 60 },
        { id: 'B', x: 210, y: 40 },
        { id: 'C', x: 130, y: 165 },
        { id: 'D', x: 265, y: 155 },
        { id: 'E', x: 200, y: 255 },
      ] satisfies WN[],
      edges: [
        { u: 0, v: 1, w: 4 },
        { u: 0, v: 2, w: 2 },
        { u: 1, v: 2, w: 1 },
        { u: 1, v: 3, w: 5 },
        { u: 2, v: 3, w: 8 },
        { u: 2, v: 4, w: 10 },
        { u: 3, v: 4, w: 2 },
      ] satisfies WE[],
      dist,
      settled,
      current,
    } satisfies DijkstraState,
    highlight: current >= 0 ? [current] : [],
  };
}

/** Dijkstra from A: settle A → C → B → D → E. */
function buildSteps(): VizStep[] {
  const F = [false, false, false, false, false];
  return [
    frame('start', 'Start: all distances ∞ except A = 0. Settle the smallest unsettled node, repeatedly.', [0, null, null, null, null], F, -1),
    frame('visit-a', 'Settle A (0). Relax: B = 4, C = 2. Smallest unsettled is C.', [0, 4, 2, null, null], [true, false, false, false, false], 0),
    frame('visit-c', 'Settle C (2). Relax: B = min(4, 3) = 3, D = 10, E = 12. Smallest unsettled is B.', [0, 3, 2, 10, 12], [true, false, true, false, false], 2),
    frame('visit-b', 'Settle B (3). Relax: D = min(10, 8) = 8. C already settled — never revisited.', [0, 3, 2, 8, 12], [true, true, true, false, false], 1),
    frame('visit-d', 'Settle D (8). Relax: E = min(12, 10) = 10. Greedy stays optimal: weights are non-negative.', [0, 3, 2, 8, 10], [true, true, true, true, false], 3),
    frame('visit-e', 'Settle E (10). Nothing left unsettled — every distance is final.', [0, 3, 2, 8, 10], [true, true, true, true, true], 4),
    frame('done', 'Done: [0, 3, 2, 8, 10]. O((V + E) log V) with a heap — one settle per vertex.', [0, 3, 2, 8, 10], [true, true, true, true, true], -1),
  ];
}

const RADIUS = 19;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as DijkstraState;

  function tone(i: number): CellTone {
    if (state.settled[i]) return 'done';
    if (i === state.current) return 'active';
    return 'default';
  }

  return (
    <svg
      className="viz-svg"
      viewBox="0 0 320 300"
      role="img"
      aria-label="Weighted graph with Dijkstra distances"
    >
      {state.edges.map((e, k) => (
        <VizEdge
          key={k}
          x1={state.nodes[e.u]?.x ?? 0}
          y1={state.nodes[e.u]?.y ?? 0}
          x2={state.nodes[e.v]?.x ?? 0}
          y2={state.nodes[e.v]?.y ?? 0}
          trim={RADIUS + 2}
          label={String(e.w)}
          tone="default"
        />
      ))}
      {state.nodes.map((n, i) => (
        <g key={n.id}>
          <VizNode x={n.x} y={n.y} value={n.id} tone={tone(i)} radius={RADIUS} />
          <text x={n.x} y={n.y + RADIUS + 15} textAnchor="middle" className="viz-cell-index">
            {state.dist[i] === null ? '∞' : `d=${state.dist[i]}`}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function DijkstraViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
