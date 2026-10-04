import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface GN {
  id: string;
  x: number;
  y: number;
}

interface TourState {
  title: string;
  nodes: GN[];
  edges: Array<[number, number]>;
  tones: CellTone[];
  /** Partition tags shown under nodes (bipartite scene). */
  tags: string[];
  order: string[];
}

function frame(
  id: string,
  description: string,
  title: string,
  nodes: GN[],
  edges: Array<[number, number]>,
  tones: CellTone[],
  tags: string[] = [],
  order: string[] = [],
): VizStep {
  return {
    id,
    description,
    state: { title, nodes, edges, tones, tags, order } satisfies TourState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

/** Scene 1: Kahn order on a DAG. Scene 2: bipartite coloring. Scene 3: two SCCs. */
function buildSteps(): VizStep[] {
  const dag: GN[] = [
    { id: '0', x: 150, y: 40 },
    { id: '1', x: 60, y: 140 },
    { id: '2', x: 240, y: 140 },
    { id: '3', x: 150, y: 240 },
  ];
  const dagEdges: Array<[number, number]> = [[0, 1], [0, 2], [1, 3], [2, 3]];
  const scc: GN[] = [
    { id: '0', x: 70, y: 90 },
    { id: '1', x: 190, y: 90 },
    { id: '2', x: 330, y: 90 },
    { id: '3', x: 450, y: 90 },
  ];
  const sccEdges: Array<[number, number]> = [[0, 1], [1, 0], [1, 2], [2, 3], [3, 2]];

  return [
    frame('dag-0', 'Scene 1 — DAG: indegrees 0 has none. Emit 0, delete its edges.', 'topological order', dag, dagEdges, [S, D, D, D], [], ['0']),
    frame('dag-1', 'Now 1 is indegree-free. Emit 1, delete 1 → 3.', 'topological order', dag, dagEdges, [DONE, S, D, D], [], ['0', '1']),
    frame('dag-2', 'Emit 2, delete 2 → 3. Then 3 drops to zero.', 'topological order', dag, dagEdges, [DONE, DONE, S, D], [], ['0', '1', '2']),
    frame('dag-3', 'Emit 3. Order 0 → 1 → 2 → 3: every edge points forward.', 'topological order', dag, dagEdges, [DONE, DONE, DONE, S], [], ['0', '1', '2', '3']),
    frame('bip-a', 'Scene 2 — bipartite: paint 0 as A. Its neighbours must be B.', '2-coloring', dag, dagEdges, [S, D, D, D], ['A', '', '', '']),
    frame('bip-b', 'Paint 1 and 2 as B. Their shared neighbour 3 must be A.', '2-coloring', dag, dagEdges, [S, C, C, D], ['A', 'B', 'B', '']),
    frame('bip-done', 'Paint 3 as A. No edge joins equal tags — bipartite ✓ (tags shown below nodes).', '2-coloring', dag, dagEdges, [S, C, C, S], ['A', 'B', 'B', 'A']),
    frame('scc-1', 'Scene 3 — SCCs: 0 ⇄ 1 reach each other (a cycle). First component found.', 'strongly connected', scc, sccEdges, [S, S, D, D]),
    frame('scc-2', '2 ⇄ 3 form the second component; 1 → 2 is a one-way bridge between them.', 'strongly connected', scc, sccEdges, [DONE, DONE, S, S]),
    frame('done', 'Done: condense each SCC to one node and any directed graph becomes a DAG.', 'strongly connected', scc, sccEdges, [DONE, DONE, DONE, DONE]),
  ];
}

const RADIUS = 19;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as TourState;
  const byIdx = new Map(state.nodes.map((n, i) => [i, n]));

  return (
    <div>
      <p className="viz-array-label">{state.title}</p>
      <svg
        className="viz-svg"
        viewBox="0 0 520 300"
        role="img"
        aria-label={`${state.title} scene`}
      >
        {state.edges.map(([u, v], k) => {
          const a = byIdx.get(u);
          const b = byIdx.get(v);
          if (!a || !b) return null;
          return (
            <VizEdge key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} trim={RADIUS + 2} tone="default" />
          );
        })}
        {state.nodes.map((n, i) => (
          <g key={n.id}>
            <VizNode x={n.x} y={n.y} value={n.id} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
            {state.tags[i] ? (
              <text x={n.x} y={n.y + RADIUS + 15} textAnchor="middle" className="viz-pointer-label">
                {state.tags[i]}
              </text>
            ) : null}
          </g>
        ))}
        {state.order.length > 0 ? (
          <text x={260} y={292} textAnchor="middle" className="viz-edge-label">
            {`order: ${state.order.join(' → ')}`}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

export default function AdvancedGraphsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
