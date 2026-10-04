import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface TopoState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  tones: CellTone[];
  activeEdges: number[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

const NODES: SceneNode[] = [
  { id: '0', x: 280, y: 48 },
  { id: '1', x: 120, y: 168 },
  { id: '2', x: 440, y: 168 },
  { id: '3', x: 280, y: 268 },
];
const EDGES: SceneEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
];
const ADJ: number[][] = [[1, 2], [3], [3], []];

/** Kahn on the diamond DAG: indegrees drain 0 → 1, 2 → 3. */
function buildSteps(): VizStep[] {
  const steps: VizStep[] = [];
  const indegree = [0, 1, 1, 2];
  const queue: number[] = [0];
  const order: number[] = [];

  const snap = (id: string, description: string, current: number, freed: number[]): void => {
    const activeEdges = freed.flatMap((v) =>
      EDGES.map((e, k) => (e.from === current && e.to === v ? k : -1)).filter((k) => k >= 0),
    );
    steps.push({
      id,
      description,
      state: {
        nodes: NODES,
        edges: EDGES,
        tones: NODES.map((_, k) => {
          if (k === current) return A;
          if (order.includes(k)) return DONE;
          return D;
        }),
        activeEdges,
        panel: [
          { label: 'queue', value: queue.length === 0 ? '[]' : `[${queue.join(', ')}]` },
          { label: 'indegree', value: `[${indegree.join(', ')}]` },
          { label: 'order', value: order.length === 0 ? '[]' : `[${order.join(', ')}]` },
        ],
      } satisfies TopoState,
      highlight: current >= 0 ? [current] : [],
    });
  };

  snap('start', 'DAG with indegrees [0, 1, 1, 2]. Only vertex 0 is ready: queue = [0].', -1, []);

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    const freed: number[] = [];
    for (const v of ADJ[u] ?? []) {
      indegree[v]--;
      if (indegree[v] === 0) {
        queue.push(v);
        freed.push(v);
      }
    }
    snap(
      `pop-${u}`,
      freed.length > 0
        ? `Emit ${u}: its edges vanish, freeing ${freed.join(' and ')} (indegree now 0).`
        : `Emit ${u}: no new vertex freed. Order so far [${order.join(', ')}].`,
      u,
      freed,
    );
  }

  steps.push({
    id: 'done',
    description: `Done: order [${order.join(', ')}] covers all 4 vertices — acyclic confirmed. Short output would mean a cycle.`,
    state: {
      nodes: NODES,
      edges: EDGES,
      tones: NODES.map(() => DONE),
      activeEdges: [],
      panel: [
        { label: 'order', value: `[${order.join(', ')}]` },
        { label: 'cycle?', value: 'no' },
      ],
    } satisfies TopoState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as TopoState;
  return (
    <div className="algo-scene">
      <GraphScene nodes={state.nodes} edges={state.edges} tones={state.tones} activeEdges={state.activeEdges} height={310} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function TopoSortViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
