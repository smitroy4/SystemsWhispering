import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface DijkstraState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  tones: CellTone[];
  activeEdges: number[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

const NAMES = ['A', 'B', 'C', 'D', 'E'];
const NODES: SceneNode[] = [
  { id: 'A', x: 90, y: 60 },
  { id: 'B', x: 280, y: 50 },
  { id: 'C', x: 180, y: 170 },
  { id: 'D', x: 430, y: 150 },
  { id: 'E', x: 300, y: 262 },
];
const EDGES: SceneEdge[] = [
  { from: 0, to: 1, label: '4' },
  { from: 0, to: 2, label: '2' },
  { from: 1, to: 2, label: '1' },
  { from: 1, to: 3, label: '5' },
  { from: 2, to: 3, label: '8' },
  { from: 2, to: 4, label: '10' },
  { from: 3, to: 4, label: '2' },
];
const ADJ: Array<Array<[number, number]>> = [
  [[1, 4], [2, 2]],
  [[0, 4], [2, 1], [3, 5]],
  [[0, 2], [1, 1], [3, 8], [4, 10]],
  [[1, 5], [2, 8], [4, 2]],
  [[2, 10], [3, 2]],
];

/** Dijkstra from A: settle A → C → B → D → E, distances [0, 3, 2, 8, 10]. */
function buildSteps(): VizStep[] {
  const INF = Number.MAX_SAFE_INTEGER;
  const dist = [0, INF, INF, INF, INF];
  const settled = [false, false, false, false, false];
  const steps: VizStep[] = [];

  const fmt = (d: number): string => (d === INF ? '∞' : String(d));
  const snap = (id: string, description: string, current: number, relaxed: number[]): void => {
    const edgeIdx = new Set<number>();
    for (const v of relaxed) {
      const k = EDGES.findIndex(
        (e) => (e.from === current && e.to === v) || (e.from === v && e.to === current),
      );
      if (k >= 0) edgeIdx.add(k);
    }
    steps.push({
      id,
      description,
      state: {
        nodes: NODES.map((n, k) => ({ ...n, sub: `d=${fmt(dist[k])}` })),
        edges: EDGES,
        tones: NODES.map((_, k) => {
          if (k === current) return A;
          if (settled[k]) return DONE;
          return D;
        }),
        activeEdges: [...edgeIdx],
        panel: [
          { label: 'dist', value: `[${dist.map(fmt).join(', ')}]` },
          { label: 'settled', value: NAMES.filter((_, k) => settled[k]).join('') || '—' },
        ],
      } satisfies DijkstraState,
      highlight: current >= 0 ? [current] : [],
    });
  };

  snap('start', 'Dijkstra from A: dist[A] = 0, rest ∞. Settle the smallest unsettled vertex.', -1, []);

  for (let round = 0; round < NODES.length; round++) {
    let u = -1;
    let best = INF;
    for (let k = 0; k < NODES.length; k++) {
      if (!settled[k] && dist[k] < best) {
        best = dist[k];
        u = k;
      }
    }
    if (u < 0) break;
    settled[u] = true;
    const relaxed: number[] = [];
    for (const [v, w] of ADJ[u] ?? []) {
      if (!settled[v] && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        relaxed.push(v);
      }
    }
    snap(
      `settle-${NAMES[u]}`,
      relaxed.length > 0
        ? `Settle ${NAMES[u]} (d=${best}): relax ${relaxed.map((v) => `${NAMES[v]}=${dist[v]}`).join(', ')}.`
        : `Settle ${NAMES[u]} (d=${best}): no edge improves. Settled vertices never change.`,
      u,
      relaxed,
    );
  }

  steps.push({
    id: 'done',
    description: `Done: dist = [${dist.map(fmt).join(', ')}]. O((V + E) log V) with a heap — one settle per vertex.`,
    state: {
      nodes: NODES.map((n, k) => ({ ...n, sub: `d=${fmt(dist[k])}` })),
      edges: EDGES,
      tones: NODES.map(() => DONE),
      activeEdges: [],
      panel: [{ label: 'dist', value: `[${dist.map(fmt).join(', ')}]` }],
    } satisfies DijkstraState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as DijkstraState;
  return (
    <div className="algo-scene">
      <GraphScene nodes={state.nodes} edges={state.edges} tones={state.tones} activeEdges={state.activeEdges} width={560} height={310} />
      <StatePanel entries={state.panel} />
    </div>
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
