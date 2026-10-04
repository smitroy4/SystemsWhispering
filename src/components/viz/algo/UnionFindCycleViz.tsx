import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import GraphScene from './graphScene.tsx';
import type { SceneEdge, SceneNode } from './graphScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface UfCycleState {
  nodes: SceneNode[];
  edges: SceneEdge[];
  tones: CellTone[];
  activeEdges: number[];
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
const ALL: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];

/** Feed [0-1, 1-2, 2-3, 3-0, 0-2]: the 4th edge finds its ends connected. */
function buildSteps(): VizStep[] {
  const parent = [0, 1, 2, 3];
  const size = [1, 1, 1, 1];
  const steps: VizStep[] = [];
  const drawn: SceneEdge[] = [];
  let components = 4;

  const find = (x: number): number => {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    return r;
  };

  const snap = (id: string, description: string, cycleEdge: number, status: string): void => {
    steps.push({
      id,
      description,
      state: {
        nodes: NODES,
        edges: [...drawn],
        tones: NODES.map(() => D),
        activeEdges: cycleEdge >= 0 ? [cycleEdge] : [],
        panel: [
          { label: 'parent', value: `[${parent.join(', ')}]` },
          { label: 'components', value: String(components) },
          { label: 'edge', value: status },
        ],
      } satisfies UfCycleState,
      highlight: [],
    });
  };

  snap('start', 'Cycle hunt on 4 vertices: union each edge; the first edge inside one component wins.', -1, '—');

  ALL.forEach(([u, v], k) => {
    const ru = find(u);
    const rv = find(v);
    if (ru === rv) {
      drawn.push({ from: u, to: v });
      snap(`cycle-${k}`, `Edge ${u}–${v}: find(${u}) = find(${v}) = ${ru} — already connected. CYCLE found, stop.`, drawn.length - 1, `${u}–${v} redundant`);
      return;
    }
    if (size[ru] < size[rv]) {
      parent[ru] = rv;
      size[rv] += size[ru];
    } else {
      parent[rv] = ru;
      size[ru] += size[rv];
    }
    components--;
    drawn.push({ from: u, to: v });
    snap(`union-${k}`, `Edge ${u}–${v}: different roots (${ru}, ${rv}) — union by size. Components: ${components}.`, -1, `${u}–${v} merged`);
  });

  steps.push({
    id: 'done',
    description: 'Done: edge 3–0 closed the cycle in near-constant time per edge: O(E · α(V)).',
    state: {
      nodes: NODES,
      edges: [...drawn],
      tones: NODES.map(() => DONE),
      activeEdges: [3],
      panel: [
        { label: 'parent', value: `[${parent.join(', ')}]` },
        { label: 'cycle edge', value: '3–0' },
      ],
    } satisfies UfCycleState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as UfCycleState;
  return (
    <div className="algo-scene">
      <GraphScene nodes={state.nodes} edges={state.edges} tones={state.tones} activeEdges={state.activeEdges} width={520} height={300} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function UnionFindCycleViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Default', hint: 'Tree edge' },
          { tone: 'active', label: 'Active', hint: 'Cycle-closing edge' },
          { tone: 'compared', label: 'Compared', hint: 'Unused here' },
          { tone: 'swapped', label: 'Swapped / Found', hint: 'Unused here' },
          { tone: 'done', label: 'Done', hint: 'Finished' },
        ]}
      />
    </>
  );
}
