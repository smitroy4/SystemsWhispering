import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface PrimState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  inTree: boolean[];
  attached: number[];
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
const EDGES: SceneEdge[] = [
  { from: 0, to: 1, label: '4' },
  { from: 0, to: 2, label: '3' },
  { from: 1, to: 2, label: '1' },
  { from: 1, to: 3, label: '2' },
  { from: 2, to: 3, label: '5' },
];

/** Prim from 0: attach 2 (3), attach 1 (1), attach 3 (2). Total 6. */
function buildSteps(): VizStep[] {
  const steps: VizStep[] = [];
  const inTree = [true, false, false, false];
  const attached: number[] = [];
  let total = 0;

  const edgeIdx = (u: number, v: number): number =>
    EDGES.findIndex((e) => (e.from === u && e.to === v) || (e.from === v && e.to === u));

  const snap = (id: string, description: string, finished: boolean): void => {
    steps.push({
      id,
      description,
      state: {
        nodes: NODES,
        edges: EDGES,
        inTree: [...inTree],
        attached: [...attached],
        finished,
        panel: [
          { label: 'in tree', value: inTree.map((t, k) => (t ? k : null)).filter((k) => k !== null).join(', ') },
          { label: 'mst weight', value: String(total) },
        ],
      } satisfies PrimState,
      highlight: [],
    });
  };

  snap('start', 'Prim from vertex 0: frontier = {0–1: 4, 0–2: 3}. Always take the cheapest crossing edge.', false);
  inTree[2] = true;
  attached.push(edgeIdx(0, 2));
  total += 3;
  snap('attach-2', 'Cheapest crossing: 0–2 (3). Attach 2. Frontier gains 2–1 (1), 2–3 (5).', false);
  inTree[1] = true;
  attached.push(edgeIdx(2, 1));
  total += 1;
  snap('attach-1', 'Cheapest crossing: 2–1 (1). Attach 1 — 0–1 (4) is now internal, ignored. Total 4.', false);
  inTree[3] = true;
  attached.push(edgeIdx(1, 3));
  total += 2;
  snap('attach-3', 'Cheapest crossing: 1–3 (2). Attach 3. Three attachments = V−1, tree complete.', false);
  snap('done', `Done: MST weight ${total}. Same answer as Kruskal, grown not sorted: O((V + E) log V).`, true);

  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as PrimState;
  return (
    <div className="algo-scene">
      <GraphScene
        nodes={state.nodes}
        edges={state.edges}
        tones={state.nodes.map((_, k) => {
          if (state.finished) return DONE;
          return state.inTree[k] ? DONE : D;
        })}
        activeEdges={state.attached}
        width={520}
        height={300}
      />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function PrimViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Default', hint: 'Outside the tree' },
          { tone: 'active', label: 'Active', hint: 'Attached MST edge' },
          { tone: 'compared', label: 'Compared', hint: 'Unused here' },
          { tone: 'swapped', label: 'Swapped / Found', hint: 'Unused here' },
          { tone: 'done', label: 'Done', hint: 'In the tree / finished' },
        ]}
      />
    </>
  );
}
