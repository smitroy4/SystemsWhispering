import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BfsState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  tones: CellTone[];
  activeEdges: number[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const C: CellTone = 'compared';
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

/** BFS from 0 on the diamond: visit order 0, 1, 2, 3. */
function buildSteps(): VizStep[] {
  const steps: VizStep[] = [];
  const seen = new Array<boolean>(4).fill(false);
  const queue: number[] = [0];
  seen[0] = true;
  const order: number[] = [];

  const edgeIndex = (u: number, v: number): number =>
    EDGES.findIndex((e) => (e.from === u && e.to === v) || (e.from === v && e.to === u));

  const snap = (id: string, description: string, current: number, fresh: number[]): void => {
    const tones: CellTone[] = NODES.map((_, k) => {
      if (k === current) return A;
      if (order.includes(k)) return DONE;
      if (seen[k]) return C;
      return D;
    });
    const activeEdges = fresh
      .map((v) => edgeIndex(current, v))
      .filter((e) => e >= 0);
    steps.push({
      id,
      description,
      state: {
        nodes: NODES,
        edges: EDGES,
        tones,
        activeEdges,
        panel: [
          { label: 'queue', value: queue.length === 0 ? '[]' : `[${queue.join(', ')}]` },
          { label: 'visited', value: `{${seen.map((s, k) => (s ? k : null)).filter((k) => k !== null).join(', ')}}` },
          { label: 'order', value: order.length === 0 ? '[]' : `[${order.join(', ')}]` },
        ],
      } satisfies BfsState,
      highlight: current >= 0 ? [current] : [],
    });
  };

  snap('start', 'BFS from node 0: queue = [0]. Waves spread one edge per round.', 0, []);

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    const fresh: number[] = [];
    for (const v of ADJ[u] ?? []) {
      if (!seen[v]) {
        seen[v] = true;
        queue.push(v);
        fresh.push(v);
      }
    }
    snap(
      `visit-${u}`,
      fresh.length > 0
        ? `Visit ${u}: discover ${fresh.join(' and ')} — they queue behind the current wave.`
        : `Visit ${u}: all neighbors already seen — nothing new queued.`,
      u,
      fresh,
    );
  }

  steps.push({
    id: 'done',
    description: `Done: order [${order.join(', ')}] in O(V + E). First arrival used fewest edges: the unweighted shortest path.`,
    state: {
      nodes: NODES,
      edges: EDGES,
      tones: NODES.map(() => DONE),
      activeEdges: [],
      panel: [
        { label: 'queue', value: '[]' },
        { label: 'order', value: `[${order.join(', ')}]` },
      ],
    } satisfies BfsState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BfsState;
  return (
    <div className="algo-scene">
      <GraphScene nodes={state.nodes} edges={state.edges} tones={state.tones} activeEdges={state.activeEdges} height={310} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function BfsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
