import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface DfsState {
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
const ADJ: number[][] = [[1, 2], [0, 3], [0, 3], [1, 2]];

/** Iterative DFS from 0 (reverse-push, left first): order 0, 1, 3, 2. */
function buildSteps(): VizStep[] {
  const steps: VizStep[] = [];
  const seen = new Array<boolean>(4).fill(false);
  const stack: number[] = [0];
  const order: number[] = [];

  const edgeIndex = (u: number, v: number): number =>
    EDGES.findIndex((e) => (e.from === u && e.to === v) || (e.from === v && e.to === u));

  const snap = (id: string, description: string, current: number, via: number): void => {
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
        activeEdges: via >= 0 ? [edgeIndex(via, current)] : [],
        panel: [
          { label: 'stack', value: stack.length === 0 ? '[]' : `[${stack.join(', ')}]` },
          { label: 'order', value: order.length === 0 ? '[]' : `[${order.join(', ')}]` },
        ],
      } satisfies DfsState,
      highlight: [current],
    });
  };

  snap('start', 'DFS from node 0: stack = [0]. Dive deep before going wide.', 0, -1);

  while (stack.length > 0) {
    const u = stack.pop()!;
    if (seen[u]) {
      continue;
    }
    seen[u] = true;
    order.push(u);
    const nbrs = ADJ[u] ?? [];
    const via = order.length >= 2 ? order[order.length - 2] : -1;
    for (let i = nbrs.length - 1; i >= 0; i--) {
      stack.push(nbrs[i]);
    }
    snap(
      `visit-${u}`,
      `Pop ${u}: mark visited, push neighbors right-to-left so ${nbrs[0] ?? 'none'} is explored first.`,
      u,
      via,
    );
  }

  steps.push({
    id: 'done',
    description: `Done: order [${order.join(', ')}] in O(V + E). Same cost as BFS, opposite shape: depth before breadth.`,
    state: {
      nodes: NODES,
      edges: EDGES,
      tones: NODES.map(() => DONE),
      activeEdges: [],
      panel: [
        { label: 'stack', value: '[]' },
        { label: 'order', value: `[${order.join(', ')}]` },
      ],
    } satisfies DfsState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as DfsState;
  return (
    <div className="algo-scene">
      <GraphScene nodes={state.nodes} edges={state.edges} tones={state.tones} activeEdges={state.activeEdges} height={310} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function DfsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
