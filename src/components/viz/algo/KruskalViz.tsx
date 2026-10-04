import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface KruskalState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  keptEdges: number[];
  currentEdge: number;
  finished: boolean;
  panel: StateEntry[];
}

const D: CellTone = 'default';
const DONE: CellTone = 'done';

const NODES: SceneNode[] = [
  { id: '0', x: 120, y: 80 },
  { id: '1', x: 400, y: 80 },
  { id: '2', x: 400, y: 240 },
  { id: '3', x: 120, y: 240 },
];
const SORTED: Array<[number, number, number]> = [[1, 2, 1], [1, 3, 2], [0, 2, 3], [0, 1, 4], [2, 3, 5]];

/** Kruskal on the square: take 1, 2, 3 — skip 4, 5 (cycles). MST weight 6. */
function buildSteps(): VizStep[] {
  const parent = [0, 1, 2, 3];
  const steps: VizStep[] = [];
  const kept: number[] = [];
  const skipped: number[] = [];
  let total = 0;

  const find = (x: number): number => {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    return r;
  };

  const snap = (id: string, description: string, active: number): void => {
    steps.push({
      id,
      description,
      state: {
        nodes: NODES,
        edges: SORTED.map(([u, v, w]) => ({ from: u, to: v, label: String(w) })),
        keptEdges: [...kept],
        currentEdge: active,
        finished: false,
        panel: [
          { label: 'mst weight', value: String(total) },
          { label: 'kept', value: `${kept.length}/3` },
        ],
      } satisfies KruskalState,
      highlight: [],
    });
  };

  snap('start', 'Kruskal: edges sorted by weight [1, 2, 3, 4, 5]. Take each unless it closes a cycle.', -1);

  SORTED.forEach(([u, v, w], k) => {
    const ru = find(u);
    const rv = find(v);
    if (ru === rv) {
      skipped.push(k);
      snap(`skip-${k}`, `Edge ${u}–${v} (w=${w}): same component — skip, it would cycle. Weight stays ${total}.`, k);
      return;
    }
    parent[rv] = ru;
    kept.push(k);
    total += w;
    snap(`take-${k}`, `Edge ${u}–${v} (w=${w}): merges components — keep. Weight = ${total}.`, k);
  });

  steps.push({
    id: 'done',
    description: `Done: 3 edges kept, MST weight ${total}. Sorting dominated: O(E log E).`,
    state: {
      nodes: NODES,
      edges: SORTED.map(([u, v, w]) => ({ from: u, to: v, label: String(w) })),
      keptEdges: [...kept],
      currentEdge: -1,
      finished: true,
      panel: [
        { label: 'mst weight', value: String(total) },
        { label: 'kept', value: `${kept.length}/3` },
      ],
    } satisfies KruskalState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as KruskalState;
  const activeEdges = [...state.keptEdges, ...(state.currentEdge >= 0 ? [state.currentEdge] : [])];
  return (
    <div className="algo-scene">
      <GraphScene
        nodes={state.nodes}
        edges={state.edges}
        tones={state.nodes.map(() => (state.finished ? DONE : D))}
        activeEdges={activeEdges}
        width={520}
        height={300}
      />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function KruskalViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Default', hint: 'Undecided edge' },
          { tone: 'active', label: 'Active', hint: 'Kept MST edge' },
          { tone: 'compared', label: 'Compared', hint: 'Unused here' },
          { tone: 'swapped', label: 'Swapped / Found', hint: 'Current edge' },
          { tone: 'done', label: 'Done', hint: 'Finished' },
        ]}
      />
    </>
  );
}
