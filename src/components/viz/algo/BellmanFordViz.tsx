import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BfState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  tones: CellTone[];
  activeEdges: number[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const DONE: CellTone = 'done';

const NODES: SceneNode[] = [
  { id: 'A', x: 90, y: 60 },
  { id: 'B', x: 280, y: 50 },
  { id: 'C', x: 180, y: 170 },
  { id: 'D', x: 430, y: 150 },
  { id: 'E', x: 300, y: 262 },
];
const DIRECTED: Array<[number, number, number]> = [
  [0, 1, 4], [1, 0, 4],
  [0, 2, 2], [2, 0, 2],
  [1, 2, 1], [2, 1, 1],
  [1, 3, 5], [3, 1, 5],
  [2, 3, 8], [3, 2, 8],
  [2, 4, 10], [4, 2, 10],
  [3, 4, 2], [4, 3, 2],
];
const EDGES: SceneEdge[] = DIRECTED.map(([from, to, w]) => ({ from, to, label: String(w) }));

/** Bellman-Ford from A: relax all 14 directed edges, 4 rounds to convergence. */
function buildSteps(): VizStep[] {
  const INF = Number.MAX_SAFE_INTEGER;
  const dist = [0, INF, INF, INF, INF];
  const steps: VizStep[] = [];

  const fmt = (d: number): string => (d === INF ? '∞' : String(d));
  const snap = (id: string, description: string, round: number, changed: string[], relaxedIdx: number[]): void => {
    steps.push({
      id,
      description,
      state: {
        nodes: NODES.map((n, k) => ({ ...n, sub: `d=${fmt(dist[k])}` })),
        edges: EDGES,
        tones: NODES.map(() => (round > 4 ? DONE : D)),
        activeEdges: relaxedIdx,
        panel: [
          { label: 'round', value: `${round} / 4` },
          { label: 'dist', value: `[${dist.map(fmt).join(', ')}]` },
          { label: 'relaxed', value: changed.length === 0 ? 'none' : changed.join(', ') },
        ],
      } satisfies BfState,
      highlight: [],
    });
  };

  snap('start', 'Bellman-Ford from A: dist = [0, ∞, ∞, ∞, ∞]. Every round relaxes all 14 directed edges.', 0, [], []);

  for (let round = 1; round <= 4; round++) {
    const changed: string[] = [];
    const relaxedIdx: number[] = [];
    DIRECTED.forEach(([u, v, w], k) => {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed.push(`${'ABCDE'[u]}→${'ABCDE'[v]}=${dist[v]}`);
        if (relaxedIdx.length < 6) relaxedIdx.push(k);
      }
    });
    snap(
      `round-${round}`,
      changed.length > 0
        ? `Round ${round}: ${changed.length} relaxations — ${changed.slice(0, 4).join(', ')}${changed.length > 4 ? '…' : ''}.`
        : `Round ${round}: nothing improves — converged early, remaining rounds are no-ops.`,
      round,
      changed,
      relaxedIdx,
    );
    if (changed.length === 0) break;
  }

  steps.push({
    id: 'done',
    description: `Done: dist = [${dist.map(fmt).join(', ')}]. V−1 rounds settle every simple path; one more round with changes would flag a negative cycle.`,
    state: {
      nodes: NODES.map((n, k) => ({ ...n, sub: `d=${fmt(dist[k])}` })),
      edges: EDGES,
      tones: NODES.map(() => DONE),
      activeEdges: [],
      panel: [
        { label: 'dist', value: `[${dist.map(fmt).join(', ')}]` },
        { label: 'neg cycle?', value: 'no' },
      ],
    } satisfies BfState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BfState;
  return (
    <div className="algo-scene">
      <GraphScene nodes={state.nodes} edges={state.edges} tones={state.tones} activeEdges={state.activeEdges} width={560} height={310} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function BellmanFordViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
