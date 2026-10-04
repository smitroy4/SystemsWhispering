import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface GraphNode {
  id: number;
  x: number;
  y: number;
}

interface GraphRepState {
  nodes: GraphNode[];
  edges: Array<[number, number]>;
  /** Vertex whose lists/matrix row and incident edges light up. */
  active: number;
}

function frame(id: string, description: string, active: number): VizStep {
  return {
    id,
    description,
    state: {
      nodes: [
        { id: 0, x: 150, y: 44 },
        { id: 1, x: 56, y: 140 },
        { id: 2, x: 244, y: 140 },
        { id: 3, x: 150, y: 236 },
      ] satisfies GraphNode[],
      edges: [[0, 1], [0, 2], [1, 3], [2, 3]] as Array<[number, number]>,
      active,
    } satisfies GraphRepState,
    highlight: active >= 0 ? [active] : [],
  };
}

const ADJ: number[][] = [[1, 2], [0, 3], [0, 3], [1, 2]];
const RADIUS = 19;

/** One diamond graph in three views, each vertex taking a turn. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'One graph, three views: drawing, adjacency lists, adjacency matrix. Edges: 0–1, 0–2, 1–3, 2–3.', -1),
    frame('v0', 'Vertex 0: list row [1, 2], matrix row has 1s at columns 1 and 2, two incident edges.', 0),
    frame('v1', 'Vertex 1: neighbours [0, 3]. Lists answer "who" in O(deg); the matrix row answers "is 1–2 an edge?" in O(1) — it is 0.', 1),
    frame('v3', 'Vertex 3: neighbours [1, 2]. Same degree as 0 — the diamond is symmetric.', 3),
    frame('done', 'Done. Sparse graphs → lists O(V + E). Dense edge tests → matrix O(V²) memory for O(1) lookups.', -1),
  ];
}

function rowTones(row: number, active: number, length: number): CellTone[] {
  return Array.from({ length }, () => (row === active ? 'swapped' : 'default'));
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as GraphRepState;
  const byId = new Map(state.nodes.map((n) => [n.id, n]));
  const incident = (e: [number, number]) =>
    state.active >= 0 && (e[0] === state.active || e[1] === state.active);

  return (
    <div>
      <p className="viz-array-label">drawing</p>
      <svg
        className="viz-svg"
        viewBox="0 0 300 280"
        role="img"
        aria-label="Diamond graph with 4 vertices"
      >
        {state.edges.map(([u, v], k) => {
          const a = byId.get(u);
          const b = byId.get(v);
          if (!a || !b) return null;
          return (
            <VizEdge key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} trim={RADIUS + 2} tone={incident([u, v]) ? 'active' : 'default'} />
          );
        })}
        {state.nodes.map((n) => (
          <VizNode key={n.id} x={n.x} y={n.y} value={n.id} tone={n.id === state.active ? 'swapped' : 'default'} radius={RADIUS} />
        ))}
      </svg>
      <p className="viz-array-label">adjacency lists</p>
      {ADJ.map((row, v) => (
        <div key={v}>
          <p className="viz-array-label">{`${v} →`}</p>
          <ArrayCells values={row} tones={rowTones(v, state.active, row.length)} pointers={[]} />
        </div>
      ))}
      <p className="viz-array-label">adjacency matrix</p>
      {ADJ.map((_, r) => (
        <ArrayCells
          key={r}
          values={ADJ.map((_, c) => (ADJ[r]?.includes(c) ? 1 : 0))}
          tones={rowTones(r, state.active, 4)}
          pointers={[]}
        />
      ))}
    </div>
  );
}

export default function GraphRepViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
