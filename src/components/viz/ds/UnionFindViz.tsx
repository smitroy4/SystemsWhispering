import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface FixedNode {
  id: number;
  x: number;
  y: number;
}

interface ForestState {
  /** Parent of each node index; root points to itself. */
  parent: number[];
  tones: CellTone[];
  /** Parent edge just rewired or walked, as [child, parent]. */
  activeEdge: [number, number] | null;
}

function frame(
  id: string,
  description: string,
  parent: number[],
  tones: CellTone[],
  activeEdge: [number, number] | null = null,
): VizStep {
  return {
    id,
    description,
    state: { parent, tones, activeEdge } satisfies ForestState,
    highlight: [],
  };
}

const NODES: FixedNode[] = [0, 1, 2, 3, 4, 5].map((id) => ({
  id,
  x: 52 + id * 92,
  y: 108,
}));
const WIDTH = 52 * 2 + 5 * 92;
const HEIGHT = 190;
const RADIUS = 19;

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** union(0,1), union(2,3), union(1,2) by rank, find(3) with compression. */
function buildSteps(): VizStep[] {
  const solo = [0, 1, 2, 3, 4, 5];
  const T = (active: number[], settled: number[], tone: CellTone = A): CellTone[] =>
    solo.map((i) => {
      if (active.includes(i)) return tone;
      if (settled.includes(i)) return DONE;
      return D;
    });

  return [
    frame('start', 'Start: 6 singletons, each its own parent. Two arrays: parent[] and rank[].', solo, T([], [])),
    frame('union-01', 'union(0, 1): equal rank — attach 1 under 0, bump rank[0]. Edge 1 → 0 appears.', [0, 0, 2, 3, 4, 5], T([0, 1], [], S), [1, 0]),
    frame('union-23', 'union(2, 3): attach 3 under 2, bump rank[2]. A second pair forms.', [0, 0, 2, 2, 4, 5], T([2, 3], [0, 1], S), [3, 2]),
    frame('union-12', 'union(1, 2): roots are 0 and 2, equal rank — hang 2 under 0. One tree of four.', [0, 0, 0, 2, 4, 5], T([0, 2], [1, 3], S), [2, 0]),
    frame('find-3', 'find(3): walk 3 → 2 → 0. Path compression rewires 3 straight to the root.', [0, 0, 0, 0, 4, 5], T([3, 2, 0], [1], A), [3, 0]),
    frame('done', 'Done: connected(0, 3) is one root comparison. Future finds from 3 cost a single hop.', [0, 0, 0, 0, 4, 5], T([], [0, 1, 2, 3])),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as ForestState;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Union-find forest"
    >
      <ArrowLabel x={NODES[0]?.x ?? 0} y={28} label="roots point to themselves" direction="down" />
      {NODES.map((n) => (
        <VizNode key={n.id} x={n.x} y={n.y} value={n.id} tone={state.tones[n.id] ?? 'default'} radius={RADIUS} />
      ))}
      {NODES.map((n) => {
        const p = state.parent[n.id];
        if (p === undefined || p === n.id) return null;
        const target = NODES[p];
        if (!target) return null;
        const active =
          state.activeEdge !== null &&
          ((state.activeEdge[0] === n.id && state.activeEdge[1] === p) ||
            (state.activeEdge[0] === p && state.activeEdge[1] === n.id));
        return (
          <VizEdge
            key={`${n.id}-${p}`}
            x1={n.x}
            y1={n.y - 34}
            x2={target.x}
            y2={target.y - 34}
            trim={6}
            tone={active ? 'active' : 'default'}
          />
        );
      })}
    </svg>
  );
}

export default function UnionFindViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
